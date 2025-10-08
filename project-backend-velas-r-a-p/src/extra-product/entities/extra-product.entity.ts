import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ExtraProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  price: number;
} 