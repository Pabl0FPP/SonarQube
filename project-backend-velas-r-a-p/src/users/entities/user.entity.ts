import { Role } from "../../common/role.enum";
import { Order } from "../../orders/entities/order.entity";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    name: string;

    @Column("text", { unique: true })
    email: string;

    @Column("text", {nullable: false, select: false})
    password: string;

    @Column("text", { array: true, default: "{user}" })
    roles: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]
}
