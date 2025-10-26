CREATE TABLE IF NOT EXISTS classrooms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    age_range text,
    lead_teacher text,
    assistant_teacher text,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS children (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id uuid REFERENCES classrooms (id) ON DELETE SET NULL,
    name text NOT NULL,
    birthdate timestamp,
    enrollment_date timestamp,
    status text NOT NULL DEFAULT 'active',
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS child_parents (
    child_id uuid REFERENCES children (id) ON DELETE CASCADE,
    parent_id uuid REFERENCES users (id) ON DELETE CASCADE,
    relationship text,
    primary_contact boolean NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS class_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id uuid REFERENCES classrooms (id) ON DELETE CASCADE,
    author_id uuid REFERENCES users (id) ON DELETE SET NULL,
    title text NOT NULL,
    summary text,
    content text NOT NULL,
    publish_at timestamp,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS class_post_attachments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES class_posts (id) ON DELETE CASCADE,
    file_url text NOT NULL,
    label text,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_children_classroom ON children (classroom_id);
CREATE INDEX IF NOT EXISTS idx_child_parents_child ON child_parents (child_id);
CREATE INDEX IF NOT EXISTS idx_child_parents_parent ON child_parents (parent_id);
CREATE INDEX IF NOT EXISTS idx_class_posts_classroom ON class_posts (classroom_id);
