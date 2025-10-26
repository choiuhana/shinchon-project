CREATE TABLE IF NOT EXISTS parent_resources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    category text,
    resource_type text NOT NULL DEFAULT 'form',
    file_url text NOT NULL,
    published_at timestamp,
    audience_scope text NOT NULL DEFAULT 'parents',
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parent_resources_type ON parent_resources (resource_type);
CREATE INDEX IF NOT EXISTS idx_parent_resources_published_at ON parent_resources ((COALESCE(published_at, created_at)));

CREATE TABLE IF NOT EXISTS parent_inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category text NOT NULL DEFAULT 'general',
    subject text NOT NULL,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'received',
    admin_reply text,
    replied_at timestamp,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parent_inquiries_parent ON parent_inquiries (parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_inquiries_status ON parent_inquiries (status);
