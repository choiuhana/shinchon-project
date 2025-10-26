CREATE TABLE IF NOT EXISTS class_schedules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id uuid REFERENCES classrooms(id) ON DELETE SET NULL,
    title text NOT NULL,
    description text,
    start_date timestamp NOT NULL,
    end_date timestamp,
    location text,
    audience_scope text NOT NULL DEFAULT 'parents',
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_class_schedules_classroom ON class_schedules (classroom_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_start_date ON class_schedules (start_date);
