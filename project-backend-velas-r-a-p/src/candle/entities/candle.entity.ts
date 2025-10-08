import { Container } from "../../container/entities/container.entity";
import { Fragance } from "../../fragance/entities/fragance.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('candle')
export class Candle {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'text', default: 'Vela Personalizada'})
    name: string;

    @Column('text')
    message: string;

    @Column('text')
    image: string;

    @Column({ type: 'int', default: 50000 })
    price: number;

    @Column('text')
    qr: string;

    @ManyToOne(() => Fragance)
    fragance: Fragance;

    @ManyToOne(() => Container)
    container: Container;
}
