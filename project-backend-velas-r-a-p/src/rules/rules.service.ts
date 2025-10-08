import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fragance } from '../fragance/entities/fragance.entity';
import { In, Repository } from 'typeorm';
import { Engine } from 'json-rules-engine';
import * as rules from './rules.json';
import { RecommendationDto } from './dto/rules.dto';

@Injectable()
export class RulesService {
  private engine: Engine;

  constructor(
    @InjectRepository(Fragance)
    private fraganceRepository: Repository<Fragance>
  ) {
    this.engine = new Engine();
  }

  /**
   * Loads rules into the engine based on the user's intention.
   * @param intention The user's intention (e.g., 'decorate', 'feel', 'gift').
   */
  private loadRules(intention: string) {
    Object.entries(rules.conditions).forEach(([ruleName, ruleConfig]) => {
      // filter rules based on intention
      const isRelevant = ruleConfig.conditions.some(
        (cond: any) => cond.fact === 'intention' && cond.value === intention
      );

      if (isRelevant) {
        this.engine.addRule({
          conditions: {
            all: ruleConfig.conditions.map(cond => ({
              fact: cond.fact,
              operator: cond.operator,
              value: cond.value,
            })),
          },
          event: ruleConfig.event,
        });
      }
    });
  }

  /**
   * Gets fragrance recommendations based on user answers using a rules engine.
   * @param answers RecommendationDto with user's answers.
   * @returns Promise with an array of recommended fragrances.
   * @throws Error if no recommendations are found.
   */
  async getRecommendations(answers: RecommendationDto) {
    // load rules based on the intention
    this.loadRules(answers.intention);

    // add facts to the engine
    this.engine.addFact('intention', async () => answers.intention);

    if (answers.intention === 'decorate') {
      this.engine.addFact('space', async () => answers.space || '');
      this.engine.addFact('ambiance', async () => answers.ambiance || '');
    } else if (answers.intention === 'feel') {
      this.engine.addFact('emotion', async () => answers.emotion || '');
    } else if (answers.intention === 'gift') {
      this.engine.addFact('occasion', async () => answers.occasion || '');
    }

    // Execute the engine with the provided answers
    const { events } = await this.engine.run(answers);

    if (!events.length) throw new Error('No hay recomendaciones para estas respuestas');

    // Get fragance names from events
    const fraganceNames = events[0]?.params?.fragance_names || [];
    if (!fraganceNames.length) throw new Error('No se encontraron nombres de fragancias');

    // Query in DB for fragances
    return this.fraganceRepository.find({
      where: { name: In(fraganceNames) },
      select: ['name', 'topNotes', 'middleNotes', 'baseNotes', 'image'],
    });
  }
}