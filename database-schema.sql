-- =====================================================
-- CASE-LAW AI PLATFORMA - POSTGRESQL MA'LUMOTLAR BAZASI SXEMASI
-- =====================================================
-- Version: 1.0
-- Database: PostgreSQL 15+
-- Created: 2026-04-23
-- Description: To'liq funksional Case-Law AI platformasi uchun ma'lumotlar bazasi sxemasi
-- =====================================================

-- =====================================================
-- 1. USERS & GAMIFICATION MODULI
-- =====================================================

-- Foydalanuvchilar asosiy jadvali
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    bio TEXT,
    date_of_birth DATE,
    
    -- Rol va status
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'premium', 'guest')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending', 'deleted')),
    
    -- Gamification
    xp_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    
    -- Premium
    subscription_plan VARCHAR(20) DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'premium', 'professional', 'enterprise')),
    subscription_expires_at TIMESTAMP,
    
    -- Security
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Foydalanuvchi xulosasi/statistikasi
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Akademik statistika
    total_cases_solved INTEGER DEFAULT 0,
    total_cases_attempted INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    average_completion_time INTEGER DEFAULT 0, -- sekundlarda
    
    -- Aktivlik statistikasi
    total_study_time INTEGER DEFAULT 0, -- daqiqalarda
    sessions_completed INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    
    -- Qiziqishlar va preferensiyalar
    preferred_difficulty VARCHAR(20) DEFAULT 'medium' CHECK (preferred_difficulty IN ('beginner', 'medium', 'advanced', 'expert')),
    preferred_categories TEXT[], -- array of legal categories
    
    -- Progress tracking
    current_lesson_id INTEGER,
    current_course_id INTEGER,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- XP transaksiyalari jadvali
CREATE TABLE xp_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Transaksiya tafsilotlari
    xp_amount INTEGER NOT NULL,
    transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN (
        'case_solved', 'lesson_completed', 'streak_bonus', 'achievement_unlocked',
        'daily_login', 'referral_bonus', 'quiz_passed', 'forum_post', 'help_given'
    )),
    
    -- Kontekstual ma'lumot
    source_type VARCHAR(30), -- 'case', 'lesson', 'achievement', etc.
    source_id INTEGER,
    description TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Yutuqlar/Badges jadvali
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    
    -- Yutuq tafsilotlari
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    category VARCHAR(30) NOT NULL CHECK (category IN (
        'academic', 'streak', 'social', 'milestone', 'special', 'hidden'
    )),
    
    -- Shartlar
    unlock_condition JSONB NOT NULL, -- JSON formatidagi shartlar
    xp_reward INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_hidden BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foydalanuvchi yutuqlari
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
    
    -- Yutuq olish ma'lumotlari
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress_data JSONB, -- yutuq progressi (agar progress bo'lsa)
    
    UNIQUE(user_id, achievement_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Streak tracking jadvali
CREATE TABLE user_streaks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Streak ma'lumotlari
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    
    -- Streak freeze (premium feature)
    freeze_count INTEGER DEFAULT 0,
    last_freeze_used DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id)
);

-- =====================================================
-- 2. LEGAL CORE MODULI
-- =====================================================

-- Sud ishlari (Cases) jadvali
CREATE TABLE cases (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    
    -- Asosiy ma'lumotlar
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    case_number VARCHAR(100),
    court_name VARCHAR(200),
    decision_date DATE,
    
    -- Kategorizatsiya
    legal_domain VARCHAR(50) NOT NULL CHECK (legal_domain IN (
        'civil', 'criminal', 'constitutional', 'administrative', 'family',
        'labor', 'commercial', 'tax', 'intellectual_property', 'environmental'
    )),
    difficulty_level VARCHAR(20) DEFAULT 'medium' CHECK (difficulty_level IN ('beginner', 'medium', 'advanced', 'expert')),
    tags TEXT[],
    
    -- Tarkib
    facts TEXT NOT NULL,
    legal_issues TEXT[],
    applicable_laws TEXT[],
    
    -- Qaror va xulosa
    decision TEXT,
    reasoning TEXT,
    precedent_value VARCHAR(20) CHECK (precedent_value IN ('low', 'medium', 'high', 'landmark')),
    
    -- Metadata
    estimated_time INTEGER DEFAULT 30, -- daqiqalarda
    min_xp_required INTEGER DEFAULT 0,
    xp_reward INTEGER DEFAULT 100,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived', 'deleted')),
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Qonunlar va qoidalar jadvali
CREATE TABLE laws (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    
    -- Asosiy ma'lumotlar
    title VARCHAR(255) NOT NULL,
    code_name VARCHAR(100) NOT NULL, -- "GK", "JK", etc.
    article_number VARCHAR(50) NOT NULL,
    
    -- Tarkib
    full_text TEXT NOT NULL,
    summary TEXT,
    interpretation TEXT,
    
    -- Kategorizatsiya
    legal_domain VARCHAR(50) NOT NULL,
    subcategory VARCHAR(100),
    tags TEXT[],
    
    -- Hierarxiya
    parent_law_id INTEGER REFERENCES laws(id),
    hierarchy_level INTEGER DEFAULT 1,
    
    -- Amal qilish
    effective_date DATE,
    expiration_date DATE,
    is_current BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    difficulty_level VARCHAR(20) DEFAULT 'medium',
    importance_level VARCHAR(20) DEFAULT 'medium' CHECK (importance_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shartnoma moddalari (Clauses) jadvali
CREATE TABLE clauses (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    
    -- Asosiy ma'lumotlar
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    clause_type VARCHAR(50) NOT NULL CHECK (clause_type IN (
        'termination', 'liability', 'payment', 'confidentiality', 'non_compete',
        'indemnification', 'force_majeure', 'dispute_resolution', 'intellectual_property',
        'governing_law', 'assignment', 'warranty', 'delivery', 'acceptance'
    )),
    
    -- Risk va muhimlik
    risk_level VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
    importance_level VARCHAR(20) DEFAULT 'medium' CHECK (importance_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Standartlashtirish
    is_template BOOLEAN DEFAULT FALSE,
    template_category VARCHAR(50),
    usage_count INTEGER DEFAULT 0,
    
    -- Tavsiyalar
    recommended_modifications TEXT[],
    common_issues TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- IRAC (Issue, Rule, Application, Conclusion) sessiyalari
CREATE TABLE irac_sessions (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    
    -- Bog'lanish
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
    
    -- IRAC komponentlari
    issue TEXT NOT NULL,
    rule TEXT NOT NULL,
    application TEXT NOT NULL,
    conclusion TEXT NOT NULL,
    
    -- AI tahlili
    ai_analysis JSONB, -- AI tomonidan qilingan tahlil
    confidence_score DECIMAL(5,2) DEFAULT 0.00,
    feedback TEXT,
    
    -- Progress tracking
    completion_status VARCHAR(20) DEFAULT 'in_progress' CHECK (completion_status IN ('not_started', 'in_progress', 'completed', 'reviewed')),
    time_spent INTEGER DEFAULT 0, -- daqiqalarda
    
    -- Baholash
    score DECIMAL(5,2) DEFAULT 0.00,
    max_score DECIMAL(5,2) DEFAULT 100.00,
    graded_by INTEGER REFERENCES users(id),
    graded_at TIMESTAMP,
    
    -- Timestamps
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. DECISION TREES MODULI
-- =====================================================

-- Decision Tree Nodes jadvali
CREATE TABLE decision_tree_nodes (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    
    -- Node turlari
    node_type VARCHAR(30) NOT NULL CHECK (node_type IN (
        'start', 'decision', 'action', 'outcome', 'info', 'question', 'condition'
    )),
    
    -- Kontent
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    
    -- Visual
    position_x DECIMAL(10,2),
    position_y DECIMAL(10,2),
    node_color VARCHAR(20) DEFAULT '#3b82f6',
    node_shape VARCHAR(20) DEFAULT 'rectangle' CHECK (node_shape IN ('rectangle', 'circle', 'diamond', 'hexagon')),
    
    -- Logic
    conditions JSONB, -- Shartlar (agar decision node bo'lsa)
    actions JSONB, -- Amallar (agar action node bo'lsa)
    outcomes JSONB, -- Natijalar (agar outcome node bo'lsa)
    
    -- Metadata
    tree_id INTEGER NOT NULL REFERENCES decision_trees(id) ON DELETE CASCADE,
    parent_node_id INTEGER REFERENCES decision_tree_nodes(id),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Decision Trees jadvali
CREATE TABLE decision_trees (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    
    -- Asosiy ma'lumotlar
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    
    -- Konfiguratsiya
    tree_type VARCHAR(30) DEFAULT 'legal_scenario' CHECK (tree_type IN (
        'legal_scenario', 'case_flow', 'decision_process', 'what_if_analysis'
    )),
    
    -- Visual sozlamalar
    layout_type VARCHAR(20) DEFAULT 'tree' CHECK (layout_type IN ('tree', 'radial', 'force')),
    default_node_color VARCHAR(20) DEFAULT '#3b82f6',
    
    -- Status
    is_public BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    
    -- Usage statistics
    usage_count INTEGER DEFAULT 0,
    average_completion_time INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Decision Tree Edges (Bog'lanishlar) jadvali
CREATE TABLE decision_tree_edges (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    
    -- Bog'lanish
    tree_id INTEGER NOT NULL REFERENCES decision_trees(id) ON DELETE CASCADE,
    from_node_id INTEGER NOT NULL REFERENCES decision_tree_nodes(id) ON DELETE CASCADE,
    to_node_id INTEGER NOT NULL REFERENCES decision_tree_nodes(id) ON DELETE CASCADE,
    
    -- Edge properties
    label VARCHAR(255),
    condition TEXT, -- Bog'lanish sharti
    weight DECIMAL(5,2) DEFAULT 1.00,
    
    -- Visual
    edge_type VARCHAR(20) DEFAULT 'solid' CHECK (edge_type IN ('solid', 'dashed', 'dotted')),
    edge_color VARCHAR(20) DEFAULT '#6b7280',
    
    -- Logic
    probability DECIMAL(5,2), -- Ehtimollik (agar stoxastik bo'lsa)
    trigger_conditions JSONB, -- Trigger shartlari
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tree_id, from_node_id, to_node_id)
);

-- What-if Scenarios jadvali
CREATE TABLE what_if_scenarios (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    
    -- Asosiy ma'lumotlar
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    base_case_id INTEGER REFERENCES cases(id),
    
    -- Scenario tafsilotlari
    scenario_type VARCHAR(30) NOT NULL CHECK (scenario_type IN (
        'legal_precedent', 'policy_change', 'fact_variation', 'procedural_change'
    )),
    
    -- O'zgarishlar
    changed_facts JSONB,
    changed_laws JSONB,
    changed_procedures JSONB,
    
    -- Natijalar
    predicted_outcome TEXT,
    confidence_score DECIMAL(5,2) DEFAULT 0.00,
    reasoning TEXT,
    
    -- Comparative analysis
    original_outcome TEXT,
    outcome_difference TEXT,
    impact_assessment JSONB,
    
    -- Metadata
    difficulty_level VARCHAR(20) DEFAULT 'medium',
    estimated_time INTEGER DEFAULT 20,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP
);

-- =====================================================
-- 4. ANALYTICS & WEAKNESS DETECTION MODULI
-- =====================================================

-- User behavior tracking jadvali
CREATE TABLE user_behavior_logs (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    
    -- Foydalanuvchi va sessiya
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    
    -- Action tafsilotlari
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN (
        'login', 'logout', 'case_start', 'case_complete', 'lesson_start', 'lesson_complete',
        'quiz_attempt', 'forum_post', 'search', 'page_view', 'click', 'scroll', 'download'
    )),
    
    -- Kontekst
    resource_type VARCHAR(30), -- 'case', 'lesson', 'law', etc.
    resource_id INTEGER,
    page_url TEXT,
    
    -- Metadata
    user_agent TEXT,
    ip_address INET,
    device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
    
    -- Performance metrics
    response_time INTEGER, -- millisekundlarda
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    
    -- Additional data
    metadata JSONB,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning analytics jadvali
CREATE TABLE learning_analytics (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    
    -- Foydalanuvchi
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Analytics turi
    analytics_type VARCHAR(30) NOT NULL CHECK (analytics_type IN (
        'learning_pattern', 'strength_analysis', 'weakness_detection', 'progress_trend',
        'engagement_metrics', 'performance_metrics', 'knowledge_gaps'
    )),
    
    -- Data
    analytics_data JSONB NOT NULL,
    confidence_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- AI insights
    ai_insights TEXT,
    recommendations JSONB,
    
    -- Period
    period_start DATE,
    period_end DATE,
    
    -- Timestamps
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Weakness detection results jadvali
CREATE TABLE weakness_detections (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    
    -- Foydalanuvchi
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Weakness tafsilotlari
    weakness_type VARCHAR(50) NOT NULL CHECK (weakness_type IN (
        'legal_concept', 'case_analysis', 'argumentation', 'research',
        'writing', 'critical_thinking', 'procedural_knowledge'
    )),
    weakness_category VARCHAR(50),
    severity_level VARCHAR(20) DEFAULT 'medium' CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Description
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    examples TEXT[],
    
    -- Detection ma'lumotlari
    detection_method VARCHAR(30) CHECK (detection_method IN (
        'pattern_analysis', 'performance_trend', 'error_analysis', 'comparison'
    )),
    confidence_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Remedy
    recommended_actions JSONB,
    practice_materials JSONB,
    estimated_improvement_time INTEGER, -- soatlarda
    
    -- Progress tracking
    status VARCHAR(20) DEFAULT 'detected' CHECK (status IN ('detected', 'addressing', 'improving', 'resolved')),
    improvement_progress INTEGER DEFAULT 0, -- 0-100%
    
    -- Timestamps
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance metrics jadvali
CREATE TABLE performance_metrics (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    
    -- Foydalanuvchi
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Metric turi
    metric_type VARCHAR(30) NOT NULL CHECK (metric_type IN (
        'accuracy', 'speed', 'consistency', 'improvement_rate', 'engagement',
        'retention', 'mastery_level', 'difficulty_adaptation'
    )),
    
    -- Values
    metric_value DECIMAL(10,2) NOT NULL,
    baseline_value DECIMAL(10,2),
    target_value DECIMAL(10,2),
    
    -- Context
    context_type VARCHAR(30), -- 'case', 'quiz', 'lesson', etc.
    context_id INTEGER,
    
    -- Period
    measurement_date DATE NOT NULL,
    period_type VARCHAR(20) DEFAULT 'daily' CHECK (period_type IN ('daily', 'weekly', 'monthly')),
    
    -- Additional data
    metadata JSONB,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- XP transactions indexes
CREATE INDEX idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX idx_xp_transactions_type ON xp_transactions(transaction_type);
CREATE INDEX idx_xp_transactions_created_at ON xp_transactions(created_at);

-- Cases table indexes
CREATE INDEX idx_cases_legal_domain ON cases(legal_domain);
CREATE INDEX idx_cases_difficulty_level ON cases(difficulty_level);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_tags ON cases USING GIN(tags);
CREATE INDEX idx_cases_created_at ON cases(created_at);

-- Laws table indexes
CREATE INDEX idx_laws_legal_domain ON laws(legal_domain);
CREATE INDEX idx_laws_code_name ON laws(code_name);
CREATE INDEX idx_laws_article_number ON laws(article_number);
CREATE INDEX idx_laws_is_current ON laws(is_current);

-- IRAC sessions indexes
CREATE INDEX idx_irac_sessions_user_id ON irac_sessions(user_id);
CREATE INDEX idx_irac_sessions_case_id ON irac_sessions(case_id);
CREATE INDEX idx_irac_sessions_status ON irac_sessions(completion_status);
CREATE INDEX idx_irac_sessions_created_at ON irac_sessions(created_at);

-- Decision trees indexes
CREATE INDEX idx_decision_tree_nodes_tree_id ON decision_tree_nodes(tree_id);
CREATE INDEX idx_decision_tree_nodes_parent_id ON decision_tree_nodes(parent_node_id);
CREATE INDEX idx_decision_tree_edges_tree_id ON decision_tree_edges(tree_id);
CREATE INDEX idx_decision_tree_edges_from_node ON decision_tree_edges(from_node_id);
CREATE INDEX idx_decision_tree_edges_to_node ON decision_tree_edges(to_node_id);

-- Analytics indexes
CREATE INDEX idx_user_behavior_logs_user_id ON user_behavior_logs(user_id);
CREATE INDEX idx_user_behavior_logs_action_type ON user_behavior_logs(action_type);
CREATE INDEX idx_user_behavior_logs_created_at ON user_behavior_logs(created_at);
CREATE INDEX idx_learning_analytics_user_id ON learning_analytics(user_id);
CREATE INDEX idx_learning_analytics_type ON learning_analytics(analytics_type);
CREATE INDEX idx_weakness_detections_user_id ON weakness_detections(user_id);
CREATE INDEX idx_weakness_detections_status ON weakness_detections(status);
CREATE INDEX idx_performance_metrics_user_id ON performance_metrics(user_id);
CREATE INDEX idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX idx_performance_metrics_date ON performance_metrics(measurement_date);

-- =====================================================
-- 6. TRIGGERS AND FUNCTIONS
-- =====================================================

-- Updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_laws_updated_at BEFORE UPDATE ON laws
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_irac_sessions_updated_at BEFORE UPDATE ON irac_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- XP and Level calculation function
CREATE OR REPLACE FUNCTION calculate_user_level(p_xp_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- Level calculation: each level requires 100 * level XP points
    -- Level 1: 0-99 XP, Level 2: 100-299 XP, Level 3: 300-599 XP, etc.
    RETURN FLOOR(SQRT(p_xp_points / 100) + 1);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user level based on XP
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.level = calculate_user_level(NEW.xp_points);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_level_trigger BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_user_level();

-- Success rate calculation for user profiles
CREATE OR REPLACE FUNCTION update_success_rate()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.total_cases_attempted > 0 THEN
        NEW.success_rate = (NEW.total_cases_solved::DECIMAL / NEW.total_cases_attempted::DECIMAL) * 100;
    ELSE
        NEW.success_rate = 0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_success_rate_trigger BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_success_rate();

-- =====================================================
-- 7. VIEWS FOR COMMON QUERIES
-- =====================================================

-- User comprehensive view
CREATE VIEW user_comprehensive AS
SELECT 
    u.*,
    up.total_cases_solved,
    up.total_cases_attempted,
    up.success_rate,
    up.average_completion_time,
    up.total_study_time,
    up.last_activity_at,
    us.current_streak,
    us.longest_streak,
    (SELECT COUNT(*) FROM user_achievements ua WHERE ua.user_id = u.id) as achievement_count
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN user_streaks us ON u.id = us.user_id;

-- Case analytics view
CREATE VIEW case_analytics AS
SELECT 
    c.*,
    (SELECT COUNT(*) FROM irac_sessions ir WHERE ir.case_id = c.id) as session_count,
    (SELECT AVG(ir.score) FROM irac_sessions ir WHERE ir.case_id = c.id AND ir.completion_status = 'completed') as average_score,
    (SELECT AVG(ir.time_spent) FROM irac_sessions ir WHERE ir.case_id = c.id AND ir.completion_status = 'completed') as average_completion_time
FROM cases c;

-- User weakness summary view
CREATE VIEW user_weakness_summary AS
SELECT 
    u.id as user_id,
    u.username,
    wd.weakness_type,
    COUNT(*) as weakness_count,
    AVG(wd.severity_level) as avg_severity,
    AVG(wd.confidence_score) as avg_confidence
FROM users u
JOIN weakness_detections wd ON u.id = wd.user_id
WHERE wd.status != 'resolved'
GROUP BY u.id, u.username, wd.weakness_type;

-- =====================================================
-- 8. SAMPLE DATA INSERTS (OPTIONAL)
-- =====================================================

-- Sample achievements
INSERT INTO achievements (name, description, category, unlock_condition, xp_reward, icon_url) VALUES
('First Steps', 'Complete your first case', 'milestone', '{"type": "case_solved", "count": 1}', 50, '/badges/first-steps.png'),
('Week Warrior', 'Maintain a 7-day streak', 'streak', '{"type": "streak", "days": 7}', 100, '/badges/week-warrior.png'),
('Legal Expert', 'Reach level 10', 'academic', '{"type": "level", "value": 10}', 500, '/badges/legal-expert.png'),
('Helpful Peer', 'Answer 10 forum questions', 'social', '{"type": "forum_help", "count": 10}', 200, '/badges/helpful-peer.png');

-- Sample legal domains
-- (Cases, laws, and other data would be populated through data import or admin interface)

-- =====================================================
-- 9. SECURITY AND CONSTRAINTS
-- =====================================================

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY user_data_policy ON users
    FOR ALL TO authenticated_users
    USING (id = current_user_id());

CREATE POLICY user_profile_policy ON user_profiles
    FOR ALL TO authenticated_users
    USING (user_id = current_user_id());

-- =====================================================
-- 10. COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'Foydalanuvchilar asosiy jadvali - gamification va barcha user ma''lumotlari';
COMMENT ON TABLE user_profiles IS 'Foydalanuvchi profiling va akademik statistikasi';
COMMENT ON TABLE xp_transactions IS 'XP transaksiyalari - har qanday XP olish/yutqazish holatlari';
COMMENT ON TABLE achievements IS 'Yutuqlar va badges tizimi';
COMMENT ON TABLE user_achievements IS 'Foydalanuvchilarning ochilgan yutuqlari';
COMMENT ON TABLE user_streaks IS 'Foydalanuvchi streak (ketma-ketlik) tracking';

COMMENT ON TABLE cases IS 'Sud ishlari - asosiy ta''lim materiallari';
COMMENT ON TABLE laws IS 'Qonunlar va qoidalar to''plami';
COMMENT ON TABLE clauses IS 'Shartnoma moddalari va qoidalar';
COMMENT ON TABLE irac_sessions IS 'IRAC metodikasi bo''yicha sessiyalar';

COMMENT ON TABLE decision_trees IS 'Decision tree asosiy jadvali';
COMMENT ON TABLE decision_tree_nodes IS 'Decision tree tugunlari';
COMMENT ON TABLE decision_tree_edges IS 'Decision tree bog''lanishlari';
COMMENT ON TABLE what_if_scenarios IS 'What-if analiz senariylari';

COMMENT ON TABLE user_behavior_logs IS 'Foydalanuvchi xatti-harakatlari loglari';
COMMENT ON TABLE learning_analytics IS 'O''qish analitikasi va AI insights';
COMMENT ON TABLE weakness_detections IS 'Foydalanuvchi zaifliklari aniqlash';
COMMENT ON TABLE performance_metrics IS 'Foydalanuvchi performance ko''rsatkichlari';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
