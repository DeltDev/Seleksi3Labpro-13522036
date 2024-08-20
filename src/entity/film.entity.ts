import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column({ nullable: true })
  description: string;
  @Column()
  director: string;
  @Column()
  release_year: number;
  @Column("simple-array")
  genre: string[];
  @Column()
  price: number;
  @Column()
  duration: number;
  @Column()
  video_url: string;
  @Column({ nullable: true })
  cover_image_url: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
