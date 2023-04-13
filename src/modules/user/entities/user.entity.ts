import { PostEntity } from "src/modules/posts/entities/post.entity";
import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn, Unique, OneToMany, ManyToMany, JoinTable } from "typeorm";

@Entity('user')
@Unique(['email'])
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: number;

    @Column({type : 'varchar', length : 100, nullable : false})
    public name : string;

    @Column({name : "email", type : 'varchar', length : 100, nullable : false})
    public email : string;

    @Column({type : 'varchar', length : 100, select : false, nullable : false})
    public password : string;

    @Column({type : 'varchar', length : 100, nullable : false})
    public role : string;

    @OneToMany(() => PostEntity, post => post.owner)
    public posts: PostEntity[]

    @ManyToMany(() => UserEntity, friend => friend.friends)
    @JoinTable()
    public friends: UserEntity[]

    @ManyToMany(() => UserEntity, friend => friend.requests)
    @JoinTable()
    public requests: UserEntity[]

    @CreateDateColumn({ nullable : false})
    public createdAt: Date;
}