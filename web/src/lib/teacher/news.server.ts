/** @deprecated Utiliser @/lib/news/articles.server */
export {
  listNewsForUser as listTeacherNewsForUser,
  markNewsRead as markTeacherNewsRead,
  getArticlesForDigest,
  getNewsArticleForUser,
  type NewsArticleListItem as TeacherNewsArticleDto,
  type NewsArticleDetail,
} from "@/lib/news/articles.server";

export { TEACHER_NEWS_TOPICS } from "@/lib/teacher/news-constants";
