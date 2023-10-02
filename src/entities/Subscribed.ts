
// src/entities/SpotifyTrack.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Subscribed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'string' }) // Map 'track_name' column to 'user_id' property
  userId: string;

  @Column({ name: 'track_json', type: 'string' }) // Map 'track_name' column to 'user_id' property
  trackJson: string;

 
}
