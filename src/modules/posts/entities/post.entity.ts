import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('post')
export class PostEntity {
    @PrimaryGeneratedColumn('uuid')
    public id:string

    @Column({type: "varchar", nullable: false})
    public description: String

    @ManyToOne(() => UserEntity, user => user.posts)
    public owner: UserEntity

    @CreateDateColumn({nullable:true})
    public created: Date;
}