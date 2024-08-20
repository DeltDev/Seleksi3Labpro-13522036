import { Film } from '../entity/film.entity';

export class FilmBuilder {
  private film: Film;

  constructor() {
    this.film = new Film();
  }

  setTitle(title: string): this {
    this.film.title = title;
    return this;
  }

  setDescription(description: string): this {
    this.film.description = description;
    return this;
  }

  setDirector(director: string): this {
    this.film.director = director;
    return this;
  }

  setReleaseYear(releaseYear: number): this {
    this.film.release_year = releaseYear;
    return this;
  }

  setGenre(genre: string[]): this {
    this.film.genre = genre;
    return this;
  }

  setPrice(price: number): this {
    this.film.price = price;
    return this;
  }

  setDuration(duration: number): this {
    this.film.duration = duration;
    return this;
  }

  setVideoUrl(videoUrl: string): this {
    this.film.video_url = videoUrl;
    return this;
  }

  setCoverImageUrl(coverImageUrl: string | null): this {
    this.film.cover_image_url = coverImageUrl;
    return this;
  }

  setCreatedAt(createdAt: Date): this {
    this.film.created_at = createdAt;
    return this;
  }
  setUpdatedAt(updatedAt: Date): this {
    this.film.updated_at = updatedAt;
    return this;
  }
  build(): Film {
    return this.film;
  }
}
