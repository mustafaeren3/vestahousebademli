import styles from "./ArticleBody.module.css";

export default function ArticleBody({ html }) {
  return <div className={styles.prose} dangerouslySetInnerHTML={{ __html: html }} />;
}
