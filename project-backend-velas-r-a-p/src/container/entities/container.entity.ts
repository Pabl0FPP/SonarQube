import { Candle } from "../../candle/entities/candle.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("containers")
export class Container {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    name: string;

    @Column("text")
    material: string

    @Column("int")
    diameter: number

    @Column("int")
    height: number

    @Column("text", {nullable: true})
    image: string;

    @OneToMany(() => Candle, (candle) => candle.container)
    candles: Candle[];
}
