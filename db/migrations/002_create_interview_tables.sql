CREATE TABLE IF NOT EXISTS interview_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  role VARCHAR(120) NOT NULL,
  difficulty VARCHAR(40) NOT NULL,
  interview_type VARCHAR(60) NOT NULL,
  duration_minutes INT NOT NULL,
  total_questions INT NOT NULL,
  answered_questions INT NOT NULL DEFAULT 0,
  current_question_index INT NOT NULL DEFAULT 0,
  score_total DECIMAL(6, 2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  KEY ix_sessions_user_id (user_id),
  CONSTRAINT fk_sessions_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS interview_questions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id BIGINT UNSIGNED NOT NULL,
  question_text TEXT NOT NULL,
  difficulty VARCHAR(40) NOT NULL,
  is_followup TINYINT(1) NOT NULL DEFAULT 0,
  order_index INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_questions_session_id (session_id),
  CONSTRAINT fk_questions_session_id FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS interview_answers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id BIGINT UNSIGNED NOT NULL,
  question_id BIGINT UNSIGNED NOT NULL,
  answer_text TEXT NOT NULL,
  score DECIMAL(4, 2) NOT NULL,
  feedback TEXT NULL,
  strengths JSON NULL,
  improvements JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_answers_session_id (session_id),
  KEY ix_answers_question_id (question_id),
  CONSTRAINT fk_answers_session_id FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_answers_question_id FOREIGN KEY (question_id) REFERENCES interview_questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS interview_reports (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id BIGINT UNSIGNED NOT NULL,
  overall_score_10 DECIMAL(4, 2) NOT NULL,
  overall_score_100 DECIMAL(5, 2) NOT NULL,
  strengths JSON NOT NULL,
  improvement_areas JSON NOT NULL,
  improved_answers JSON NOT NULL,
  next_topics JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_reports_session_id (session_id),
  CONSTRAINT fk_reports_session_id FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);
