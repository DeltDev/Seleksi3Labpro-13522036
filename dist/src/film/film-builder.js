"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilmBuilder = void 0;
const film_entity_1 = require("../entity/film.entity");
class FilmBuilder {
    constructor() {
        this.film = new film_entity_1.Film();
    }
    setTitle(title) {
        this.film.title = title;
        return this;
    }
    setDescription(description) {
        this.film.description = description;
        return this;
    }
    setDirector(director) {
        this.film.director = director;
        return this;
    }
    setReleaseYear(releaseYear) {
        this.film.release_year = releaseYear;
        return this;
    }
    setGenre(genre) {
        this.film.genre = genre;
        return this;
    }
    setPrice(price) {
        this.film.price = price;
        return this;
    }
    setDuration(duration) {
        this.film.duration = duration;
        return this;
    }
    setVideoUrl(videoUrl) {
        this.film.video_url = videoUrl;
        return this;
    }
    setCoverImageUrl(coverImageUrl) {
        this.film.cover_image_url = coverImageUrl;
        return this;
    }
    setCreatedAt(createdAt) {
        this.film.created_at = createdAt;
        return this;
    }
    setUpdatedAt(updatedAt) {
        this.film.updated_at = updatedAt;
        return this;
    }
    build() {
        return this.film;
    }
}
exports.FilmBuilder = FilmBuilder;
//# sourceMappingURL=film-builder.js.map