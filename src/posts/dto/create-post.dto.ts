export class CreatePostDto {
    readonly title: string;
    readonly content: string;
    readonly tags: string[];
    readonly createdAt: Date;
    readonly images?: string[];
}
