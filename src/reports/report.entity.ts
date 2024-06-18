import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  year: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  mileage: number;
}
