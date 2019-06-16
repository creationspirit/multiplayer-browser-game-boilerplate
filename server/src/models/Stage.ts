import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

type edgarExerciseResponse = {
  id: number;
  title: string;
  description: string;
  no_questions: number;
};

@Entity()
export class Stage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  edgarId!: number;

  @Column({ length: 100 })
  title!: string;

  @Column({ length: 200 })
  description!: string;

  loadFromEdgarResponse(exercise: edgarExerciseResponse) {
    this.edgarId = exercise.id;
    this.title = exercise.title;
    this.description = exercise.description;
  }
}
