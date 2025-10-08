import { Candle } from "../../candle/entities/candle.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("fragances")
export class Fragance {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    name: string;

    @Column("text")
    topNotes: string;

    @Column("text")
    middleNotes: string;

    @Column("text")
    baseNotes: string;

    @Column("text", {nullable: true})
    image: string;

    @OneToMany(() => Candle, (candle) => candle.fragance)
    candles: Candle [];
}
