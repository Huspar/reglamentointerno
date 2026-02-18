
CREATE TABLE IF NOT EXISTS audit_events (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  model_variant TEXT NOT NULL,
  issues JSONB NOT NULL,
  fixes JSONB NOT NULL,
  autofix_applied BOOLEAN NOT NULL DEFAULT FALSE,
  has_error BOOLEAN NOT NULL DEFAULT FALSE,
  error_count INT NOT NULL DEFAULT 0,
  warn_count INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS audit_events_created_at_idx ON audit_events (created_at DESC);
CREATE INDEX IF NOT EXISTS audit_events_has_error_idx ON audit_events (has_error);
