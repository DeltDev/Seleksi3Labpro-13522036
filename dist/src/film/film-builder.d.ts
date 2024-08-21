import { Film } from '../entity/film.entity';
export declare class FilmBuilder {
    private film;
    constructor();
    setTitle(title: string): this;
    setDescription(description: string): this;
    setDirector(director: string): this;
    setReleaseYear(releaseYear: number): this;
    setGenre(genre: string[]): this;
    setPrice(price: number): this;
    setDuration(duration: number): this;
    setVideoUrl(videoUrl: string): this;
    setCoverImageUrl(coverImageUrl: string | null): this;
    setCreatedAt(createdAt: Date): this;
    setUpdatedAt(updatedAt: Date): this;
    build(): Film;
}
