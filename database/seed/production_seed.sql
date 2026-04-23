-- Production Seed Data for Case-Law AI Platform
-- Complete database initialization with all required data

-- =============================================
-- USERS AND ROLES
-- =============================================

-- Admin user
INSERT INTO users (
    id, email, name, password, role, xp, level, streak, total_cases, win_rate,
    subscription_id, created_at, updated_at, last_active_at
) VALUES (
    'admin_001',
    'admin@caselaw.ai',
    'System Administrator',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6QJw/2Ej7W', -- password: admin123
    'ADMIN',
    10000,
    50,
    365,
    0,
    0.0,
    'sub_admin',
    NOW() - INTERVAL '365 days',
    NOW(),
    NOW()
);

-- Sample teacher
INSERT INTO users (
    id, email, name, password, role, xp, level, streak, total_cases, win_rate,
    subscription_id, created_at, updated_at, last_active_at
) VALUES (
    'teacher_001',
    'teacher@caselaw.ai',
    'Aliyev Karim',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6QJw/2Ej7W', -- password: teacher123
    'TEACHER',
    5000,
    25,
    180,
    150,
    0.85,
    'sub_premium',
    NOW() - INTERVAL '180 days',
    NOW(),
    NOW()
);

-- Sample students
INSERT INTO users (
    id, email, name, password, role, xp, level, streak, total_cases, win_rate,
    subscription_id, created_at, updated_at, last_active_at
) VALUES 
('student_001', 'student1@caselaw.ai', 'Student One', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6QJw/2Ej7W', 'STUDENT', 2500, 12, 45, 80, 0.75, 'sub_basic', NOW() - INTERVAL '45 days', NOW(), NOW()),
('student_002', 'student2@caselaw.ai', 'Student Two', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6QJw/2Ej7W', 'STUDENT', 1800, 9, 30, 65, 0.70, 'sub_free', NOW() - INTERVAL '30 days', NOW(), NOW()),
('student_003', 'student3@caselaw.ai', 'Student Three', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6QJw/2Ej7W', 'STUDENT', 3200, 16, 60, 120, 0.82, 'sub_premium', NOW() - INTERVAL '60 days', NOW(), NOW());

-- =============================================
-- LAWS (Uzbekistan Legal Codes)
-- =============================================

-- Civil Code Articles
INSERT INTO laws (
    id, uuid, title, code_name, article_number, full_text, summary, interpretation,
    legal_domain, subcategory, tags, importance_level, difficulty_level,
    effective_date, is_current, created_at, updated_at
) VALUES 
-- Civil Code - Contract Law
('law_001', 'uuid_law_001', 'Shartnoma erkinligi', 'Fuqarolik Kodeksi', '357-modda', 
'Fuqarolar va tashkilotlar oʻz xohish-irodalariga koʻra shartnoma tuzish huquqiga egadirlar. Shartnoma qonun hujjatlarida nazarda tutilgan majburiy talablarni, shartnomaning mohiyatiga zid boʻlmagan holda, qonunga zid boʻlmagan holda, shuningdek, ommaviylik axloqiga zid boʻlmagan holda belgilanishi mumkin.',
'Shartnoma tuzishning asosiy prinsiplari: erkinlik, ixtiyoriylik, qonunga zid boʻlmaslik.',
'Shartnoma erkinligi - bu fuqarolarning va tashkilotlarning qonun doirasida oʻz xohishiga koʻra shartnoma tuzish, shartnoma turi va shartlarini belgilash huquqi.',
'civil', 'contract_law', 
ARRAY['shartnoma', 'erkinlik', 'fuqarolik', 'tashkilot', 'iroda', 'qonun'],
'high', 'medium',
'1996-12-25', true, NOW(), NOW()),

('law_002', 'uuid_law_002', 'Shartnoma tuzish shakli', 'Fuqarolik Kodeksi', '360-modda',
'Shartnoma yozma shaklda, ogʻzaki shaklda yoki tomonlar oʻrtasida oʻrnatilgan odatlarda belgilanishi mumkin. Agar qonun shartnoma uchun yozma shaklni majburiy deb belgilasa, shartnoma yozma shaklda tuzilishi lozim. Yozma shakldagi shartnoma tomonlardan birining imzosi bilan tasdiqlanishi, agar shartnoma tuzish toʻgʻrisida oʻzaro kelishuv xati yuritilgan boʻlsa, xat almashinish orqali, shuningdek, telefon, teleks, elektron pochtta yoki boshqa aloqa vositalari orqali amalga oshirilishi mumkin.',
'Shartnoma tuzish shakllari: yozma, ogʻzaki, odatlar boʻyicha.',
'Shartnoma tuzish shakli - qonunda belgilangan tartibda shartnoma tuzish usuli. Yozma shakl - qogʻoz yoki elektron shaklda hujjat.',
'civil', 'contract_form',
ARRAY['shartnoma', 'yozma', 'ogʻzaki', 'imzo', 'elektron', 'shakl'],
'high', 'easy',
'1996-12-25', true, NOW(), NOW()),

('law_003', 'uuid_law_003', 'Shartnomaning mohiyati', 'Fuqarolik Kodeksi', '365-modda',
'Shartnomaning mohiyati - bu tomonlarning shartnomaga koʻra olishi, bajarishi yoki bajarmaslik majburiyatini oʻz zimmasiga olishi, shuningdek, tomonlarning shartnomaga koʻra olishi mumkin boʻlgan huquqlar chegarasini belgilash toʻgʻrisidagi oʻzaro kelishuvidir. Shartnoma mohiyati tomonlarning oʻzaro kelishuviga asosan belgilanadi.',
'Shartnomaning asosiy elementlari: majburiyatlar, huquqlar, kelishuv.',
'Shartnoma mohiyati - shartnomaning mazmuni, yaʼni tomonlarning oʻzaro kelishuviga asosan belgilangan majburiyatlar va huquqlar.',
'civil', 'contract_essence',
ARRAY['shartnoma', 'mohiyat', 'majburiyat', 'huquq', 'kelishuv'],
'high', 'medium',
'1996-12-25', true, NOW(), NOW()),

-- Criminal Code Articles
('law_004', 'uuid_law_004', 'Jinoyat tarkibi', 'Jinoyat Kodeksi', '7-modda',
'Jinoyat qilmish faqat shu Kodeksda jinoyat deb topilgan ijtimoiy xavfli qilmalardir. Jinoyat tarkibiga: qilmalarning jinoyat qilinish obyektiv belgilari, shu qilmalarni sodir etgan shaxsning aybdorligining subyektiv belgilari kiradi.',
'Jinoyat tarkibi - ijtimoiy xavfli qilmaning obyektiv va subyektiv belgilari majmuasi.',
'Jinoyat tarkibi - qonunda belgilangan belgilar toʻplami boʻlib, ular mavjud boʻlganda qilma jinoyat hisoblanadi.',
'criminal', 'general_provisions',
ARRAY['jinoyat', 'tarkib', 'obyektiv', 'subyektiv', 'ijtimoiy xavflilik'],
'high', 'hard',
'1994-09-22', true, NOW(), NOW()),

('law_005', 'uuid_law_005', 'Oʻgʻirlik', 'Jinoyat Kodeksi', '169-modda',
'Oʻgʻirlik - bu boshqa kishining mol-mulkini ochiq oʻgʻirlash yoki unga tegishli mol-mulkiy qonuniy asossiz tortib olish yoʻli bilan olish. Agar oʻgʻirlik qilish jarayonida zoʻravonlik qoʻllanilsa, u oʻgʻirlikning ogʻirlashtiruvchi holati hisoblanadi.',
'Mol-mulkni ochiq oʻgʻirlash yoki tortib olish.',
'Oʻgʻirlik - boshqa kishining mol-mulkini ochiq usulda, zoʻravonliksiz olish. Agar zoʻravonlik qoʻllanilsa, bu talonchilik boʻladi.',
'criminal', 'property_crimes',
ARRAY['oʻgʻirlik', 'mol-mulk', 'ochiq oʻgʻirlash', 'tortib olish'],
'high', 'medium',
'1994-09-22', true, NOW(), NOW()),

-- Administrative Code Articles
('law_006', 'uuid_law_006', 'Maʼmuriy huquqbuzarlik', 'Maʼmuriy javobgarlik toʻgʻrisidagi kodeks', '19-modda',
'Maʼmuriy huquqbuzarlik - bu fuqarolarning, mansabdor shaxslarning va yuridik shaxslarning davlat organlari, jamoat birlashmalari, mansabdor shaxslarning qonun hujjatlarida belgilangan tartibda va doiralarda oʻz vazifalarini bajarishlari hamda fuqarolarning huquq va manfaatlarini himoya qilishlari toʻgʻrisidagi qonun hujjatlarini buzishi hisoblanadi.',
'Qonun hujjatlarini buzish natijasida yuzaga keladigan maʼmuriy javobgarlik.',
'Maʼmuriy huquqbuzarlik - qonun hujjatlarini buzish boʻlib, u uchun maʼmuriy javobgarlik belgilanadi.',
'administrative', 'general_provisions',
ARRAY['maʼmuriy', 'huquqbuzarlik', 'qonun', 'buzish', 'javobgarlik'],
'medium', 'easy',
'1994-09-22', true, NOW(), NOW());

-- =============================================
-- COURT DECISIONS
-- =============================================

INSERT INTO court_decisions (
    id, uuid, title, description, case_number, court_name, decision_date,
    legal_domain, difficulty_level, tags, facts, legal_issues, applicable_laws,
    decision, reasoning, precedent_value, estimated_time, min_xp_required,
    xp_reward, status, is_featured, created_at, created_by
) VALUES 
-- Supreme Court Plenum Decision on Contract Freedom
('decision_001', 'uuid_dec_001', 
'Oliy Sud Plenumining shartnoma erkinligi toʻgʻrisidagi qarori',
'Shartnoma erkinligi prinsipini talqin qilish va uni qoʻllash masalalari',
'П-2023-15',
'Oʻzbekiston Respublikasi Oliy Sudining Plenumi',
'2023-06-15',
'civil',
'hard',
ARRAY['shartnoma', 'erkinlik', 'plenum', 'talqin'],
'Toshkent shahridagi "ABC" kompaniyasi va "XYZ" MChJ oʻrtasida tuzilgan yetkazib berish shartnomasida qonunga zid boʻlgan shartlar mavjudligi toʻgʻrisida daʼvo qilingan. Sud birinchi instantsiyada shartnomaning ayrim bandlari bekor qilingan.',
'1. Shartnoma erkinligi chegarasi qayerdan boshlanadi? 2. Qonunga zid shartlarning oqibati nima boʻladi? 3. Shartnomada qonunga zid shartlar boʻlishi mumkinmi?',
ARRAY['357-modda', '360-modda', '365-modda'],
'Shartnomadagi qonunga zid boʻlgan shartlar (masalan, bir tomonning barcha javobgarligini ozod qilish) bekor qilinadi, ammo shartnomaning qolgan qismi saqlanib qoladi. Shartnoma erkinligi mutlaq emas, u qonun, ommaviylik axloqi va shartnoma mohiyatiga zid boʻlishi mumkin emas.',
'Shartnoma erkinligi fuqarolik huquqining asosiy prinsiplaridan biri boʻlib, u Konstitutsiyada va Fuqarolik kodeksida mustahkamlangan. Biroq bu erkinlik cheklovlarga ega: 1) Qonun hujjatlarida nazarda tutilgan majburiy talablar; 2) Shartnomaning mohiyatiga zid boʻlish; 3) Qonunga zid boʻlish; 4) Ommaviylik axloqiga zid boʻlish. Sud ushbu ishda shartnomadagi javobgarlikni butunlay ozod qiluvchi bandni bekor qildi, chunki bu Fuqarolik kodeksining 357-moddasiga zid.',
'high',
45,
100,
200,
'active',
true,
NOW(),
'admin_001'),

-- Supreme Court Decision on Theft Classification
('decision_002', 'uuid_dec_002',
'Oʻgʻirlik va talonchilikning farqi toʻgʻrisidagi qaror',
'Oʻgʻirlik va talonchilik jinoyatlarini farqlash mezonlari',
'К-2023-89',
'Oʻzbekiston Respublikasi Oliy Sudining Jinoyat ishlari boʻyicha sud kollegiyasi',
'2023-08-20',
'criminal',
'medium',
ARRAY['oʻgʻirlik', 'talonchilik', 'zoʻravonlik', 'farqlash'],
'Akimov Toshkent shahrida doʻkonning eshigini ochib, ichiga kirib, pul qutisini olib chiqqan. Sud birinchi instantsiyada bu harakat oʻgʻirlik deb topilgan, prokuratura esa talonchilik deb hisoblagan.',
'1. Oʻgʻirlik va talonchilikning asosiy farqi nima? 2. Qachon oʻgʻirlik talonchilikka aylanadi? 3. Zoʻravonlik tushunchasi qanday talqin qilinadi?',
ARRAY['169-modda', '166-modda'],
'Akimovning harakati oʻgʻirlik sifatida qayd etiladi, chunki u mol-mulkni ochiq oʻgʻirlash yoʻli bilan olgan. Zoʻravonlik qoʻllanmaganligi sababli, bu talonchilik emas. Oʻgʻirlikda mol-mulk ochiq oʻgʻirlanadi, talonchilikda esa yashirin yoki zoʻravonlik bilan olinadi.',
'Oʻgʻirlik (169-modda) va talonchilik (166-modda) oʻrtasidagi asosiy farq - bu mol-mulkni olish usuli. Oʻgʻirlikda mol-mulk ochiq oʻgʻirlanadi, talonchilikda esa yashirin olinadi yoki zoʻravonlik qoʻllaniladi. Sud ushbu ishda Akimov pul qutisini ochiq olib chiqqani sababli, bu harakat oʻgʻirlik deb topildi. Zoʻravonlikning mavjudligi talonchilikning majburiy belgisidir.',
'high',
30,
75,
150,
'active',
true,
NOW(),
'admin_001');

-- =============================================
-- LAW-COURT DECISION RELATIONSHIPS
-- =============================================

INSERT INTO law_court_decisions (
    id, law_id, court_decision_id, relevance_score, context, created_at
) VALUES 
('rel_001', 'law_001', 'decision_001', 1.0, 'Shartnoma erkinligi prinsipini toʻgʻridan-toʻgʻri izohlaydi', NOW()),
('rel_002', 'law_002', 'decision_001', 0.9, 'Shartnoma shakllariga oid qaror', NOW()),
('rel_003', 'law_003', 'decision_001', 0.8, 'Shartnoma mohiyatiga oid talqin', NOW()),
('rel_004', 'law_005', 'decision_002', 1.0, 'Oʻgʻirlik tushunchasini toʻgʻri izohlaydi', NOW()),
('rel_005', 'law_004', 'decision_002', 0.7, 'Jinoyat tarkibiga oid umumiy tamoyillar', NOW());

-- =============================================
-- LEGAL DICTIONARY
-- =============================================

INSERT INTO legal_dictionary (
    id, term, definition, explanation, category, synonyms, examples, related_terms,
    source, last_updated, created_at, updated_at
) VALUES 
-- Contract Law Terms
('dict_001', 'shartnoma', 
'Ikkala yoki undan ortiq tomon oʻrtasida tuzilgan, huquqiy oqibatlarga ega boʻlgan kelishuv.',
'Shartnoma - bu fuqarolarning yoki tashkilotlarning oʻzaro huquqiy munosabatlarni belgilovchi hujjat. U tomonlarning majburiyatlarini, huquqlarini va masʼuliyatlarini oʻz ichiga oladi.',
'contract_law',
ARRAY['kelishuv', 'bitim', 'kontrakt', 'soglashma'],
ARRAY['Mehnat shartnomasi', 'Sotib olish shartnomasi', 'Ijara shartnomasi'],
ARRAY['majburiyat', 'huquq', 'tomon', 'iroda'],
'Fuqarolik kodeksi izohi', NOW(), NOW(), NOW()),

('dict_002', 'iroda',
'Insonning oʻz xohishi va xulq-atishini belgilash, shuningdek, oʻz harakatlariga maʼno berish qobiliyati.',
'Iroda - bu insonning ongli ravishda qaror qabul qilish va uni amalga oshirish qobiliyati. Huquqiy jihatdan, iroda toʻliq, xolis va ixtiyoriy boʻlishi kerak.',
'general',
ARRAY['xohish', 'niyat', 'qaror', 'tanlov'],
ARRAY['Shartnoma tuzishga iroda', 'Vasiyatnomada iroda'],
ARRAY['shartnoma', 'kelishuv', 'huquqiy qobiliyat'],
'Qonunshunoslik lugʻati', NOW(), NOW(), NOW()),

('dict_003', 'majburiyat',
'Qonun yoki shartnoma asosida shaxsning bajarishi shart boʻlgan harakat yoki harakatsizlik.',
'Majburiyat - bu shaxsning qonun yoki shartnoma asosida maʼlum bir harakatni bajarish yoki bajarmaslik majburiyati. Bajarmaslik huquqiy javobgarlikka olib kelishi mumkin.',
'general',
ARRAY['tashvif', 'zimma', 'masʼuliyat'],
ARRAY['Shartnoma boʻyicha majburiyat', 'Qonun boʻyicha majburiyat'],
ARRAY['shartnoma', 'qonun', 'javobgarlik'],
'Huquqiy ensiklopediya', NOW(), NOW(), NOW()),

-- Criminal Law Terms
('dict_004', 'jinoyat',
'Ijtimoiy xavflilik darajasi yuqori boʻlgan va qonunda jinoyat deb topilgan qilma.',
'Jinoyat - bu jamiyat uchun xavfli boʻlgan, insonning hayotiga, sogʻligʻiga yoki mol-mulkiga zarar yetkazishi mumkin boʻlgan qilma. U faqat qonunda belgilangan tartibda jinoyat deb topilishi mumkin.',
'criminal',
ARRAY['jinoyatchilik', 'huquqbuzarlik', 'qilmish'],
ARRAY['Oʻgʻirlik jinoyati', 'Talonchilik jinoyati', 'Qotillik jinoyati'],
ARRAY['jinoyat tarkibi', 'aybdorlik', 'jazolash'],
'Jinoyat kodeksi izohi', NOW(), NOW(), NOW()),

('dict_005', 'aybdorlik',
'Jinoyat sodir etgan shaxsning oʻz qilmishi uchun javob berishi.',
'Aybdorlik - bu jinoyat sodir etgan shaxsning oʻz harakati uchun qonun oldida javob berishi. U faqat sud tomonidan aniqlanishi mumkin.',
'criminal',
ARRAY['masʼuliyat', 'javobgarlik', 'ayb'],
ARRAY['Aybdorlikni tan olish', 'Aybdorlikning isbotlanishi'],
ARRAY['jinoyat', 'sud', 'isbot'],
'Qonunshunoslik asoslari', NOW(), NOW(), NOW()),

-- Administrative Law Terms
('dict_006', 'maʼmuriy huquqbuzarlik',
'Davlat organlari yoki mansabdor shaxslarning qonun hujjatlarini buzishi.',
'Maʼmuriy huquqbuzarlik - bu qonun hujjatlarini buzish boʻlib, u uchun maʼmuriy javobgarlik (jarima, ogohlantirish) belgilanadi. U jinoyatdan yengilroq huquqbuzarlik turi hisoblanadi.',
'administrative',
ARRAY['huquqbuzarlik', 'qoidabuzarlik', 'buzilish'],
ARRAY['Yoʻl harakati qoidalarini buzish', 'Ommaviy tadbirda tartibni buzish'],
ARRAY['jarima', 'ogohlantirish', 'maʼmuriy javobgarlik'],
'Maʼmuriy huquq asoslari', NOW(), NOW(), NOW());

-- =============================================
-- DOCUMENT TEMPLATES
-- =============================================

INSERT INTO document_templates (
    id, name, type, description, template, variables, category, is_public,
    created_at, updated_at
) VALUES 
-- Complaint Template
('template_001', 
'Standart daʼvo arizasi',
'complaint',
'Sudga daʼvo arizasi berish uchun standart shablon',
'''DAʼVO ARIZASI

{{ court_name }}ga

Daʼvogʻi: {{ user.name }}
Manzili: {{ user.address }}
Telefon: {{ user.phone }}
Passport: {{ user.passport_series }} {{ user.passport_number }}

Javobgar: {{ defendant.name }}
Manzili: {{ defendant.address }}

DAʼVO HAQIDA
{{ case_data.claim_description }}

DAʼVO TALABLARI
1. {{ case_data.claim_amount }} soʻm miqdorida pul mablagʻini undirish.
2. Sud harajatlarini javobkorgʼ yuklash.

HUQUQIY ASOSLAR
{{ legal_basis }}

ILIMI
{{ case_data.facts }}

Qoʻshimcha:
{{ case_data.evidence | join(", ") }}

Sana: {{ current_date }}
Daʼvogʻi: __________________ (imzo)
{{ user.name }}''',
'{"user": "Foydalanuvchi maʼlumotlari", "defendant": "Javobgar maʼlumotlari", "case_data": "Ish maʼlumotlari", "legal_basis": "Huquqiy asoslar", "current_date": "Joriy sana"}',
'civil',
true,
NOW(),
NOW()),

-- Petition Template
('template_002',
'Ariza shabloni',
'petition',
'Har xil arizalar uchun umumiy shablon',
'''ARIZA

{{ court_name }}ga

Ariza beruvchi: {{ user.name }}
Manzili: {{ user.address }}
Telefon: {{ user.phone }}

ARIZA MAVZUSI
{{ case_data.petition_subject }}

ARIZA MATNI
{{ case_data.facts }}

SOʻROV
{{ case_data.petition_request }}

ILIMI
{{ case_data.evidence | join(", ") }}

Sana: {{ current_date }}
Ariza beruvchi: __________________ (imzo)
{{ user.name }}''',
'{"user": "Foydalanuvchi maʼlumotlari", "case_data": "Ariza maʼlumotlari", "current_date": "Joriy sana"}',
'general',
true,
NOW(),
NOW()),

-- Contract Template
('template_003',
'Sotib olish shartnomasi',
'contract',
'Mol-mulk sotib olish shartnomasi shabloni',
'''SOTIB OLISH SHARTNOMASI

{{ current_date }} yil {{ current_date.split("-")[2] }}-{{ current_date.split("-")[1] }}-{{ current_date.split("-")[0] }}

Shahar {{ current_city }}

Biz, quyidagilar:

1. Sotuvchi: {{ user.name }}
   Manzili: {{ user.address }}
   Telefon: {{ user.phone }}
   Passport: {{ user.passport_series }} {{ user.passport_number }}

2. Sotib oluvchi: {{ party2.name }}
   Manzili: {{ party2.address }}
   Telefon: {{ party2.phone }}
   Passport: {{ party2.passport_series }} {{ party2.passport_number }}

ushbu shartnomaga quyidagilarni belgiladik:

1. SHARTNOMA MAVZUSI
{{ contract.subject }}

2. SHARTNOMA SUMMASI
{{ contract.value }} {{ contract.currency }}

3. TOʻLOV TARTIBI
{{ contract.payment_terms }}

4. TOPSHIRISH
{{ contract.delivery_terms }}

5. JAVOBGARLIK
Tomonlar shartnoma shartlarini toʻliq bajarish majburiyatini oladilar.

6. NIZOLARNI HAL QILISH
Nizolar muzokara yoʻli bilan hal qilinadi.

Shartnoma 2 nusxada tuzilgan, har bir tomon uchun 1 nusxadan.

SOTUVCHI: __________________ (imzo)
{{ user.name }}

SOTIB OLUVCHI: __________________ (imzo)
{{ party2.name }}''',
'{"user": "Sotuvchi maʼlumotlari", "party2": "Sotib oluvchi maʼlumotlari", "contract": "Shartnoma shartlari", "current_date": "Joriy sana", "current_city": "Joriy shahar"}',
'contract',
true,
NOW(),
NOW());

-- =============================================
-- ACHIEVEMENTS
-- =============================================

INSERT INTO achievements (
    id, name, description, category, icon, requirement_type, requirement_value,
    xp_reward, badge_color, is_active, created_at, updated_at
) VALUES 
('ach_001', 'Birinchi qadam', 'Tizimda birinchi marta roʻyxatdan oʻtish', 'onboarding', '🎯', 'registration', 1, 50, '#10b981', true, NOW(), NOW()),
('ach_002', 'IRAC boshlovchisi', 'Birinchi IRAC sessiyasini tugatish', 'learning', '📚', 'irac_sessions', 1, 100, '#3b82f6', true, NOW(), NOW()),
('ach_003', 'Qonun bilimdoni', '10 ta qonun moddasini oʻrganish', 'learning', '⚖️', 'laws_studied', 10, 200, '#8b5cf6', true, NOW(), NOW()),
('ach_004', 'Sud jangchisi', '50 ta ishni hal qilish', 'performance', '⚔️', 'cases_completed', 50, 500, '#ef4444', true, NOW(), NOW()),
('ach_005', 'Kundalik faol', '7 kun ketma-ket tizimga kirish', 'engagement', '🔥', 'streak_days', 7, 150, '#f59e0b', true, NOW(), NOW()),
('ach_006', 'Oʻqituvchi yordamchisi', '10 ta talabaga yordam berish', 'teaching', '👨‍🏫', 'students_helped', 10, 300, '#06b6d4', true, NOW(), NOW()),
('ach_007', 'Tajribali huquqshunos', '1000 XP toʻplash', 'milestone', '🏆', 'xp_total', 1000, 1000, '#ec4899', true, NOW(), NOW()),
('ach_008', 'Perfectionist', '10 ta ishni 100% ball bilan tugatish', 'performance', '💯', 'perfect_cases', 10, 750, '#14b8a6', true, NOW(), NOW());

-- =============================================
-- USER ACHIEVEMENTS (Sample)
-- =============================================

INSERT INTO user_achievements (
    id, user_id, achievement_id, unlocked_at, progress, created_at, updated_at
) VALUES 
('ua_001', 'student_001', 'ach_001', NOW() - INTERVAL '45 days', 100, NOW(), NOW()),
('ua_002', 'student_001', 'ach_002', NOW() - INTERVAL '40 days', 100, NOW(), NOW()),
('ua_003', 'student_001', 'ach_003', NOW() - INTERVAL '30 days', 100, NOW(), NOW()),
('ua_004', 'student_002', 'ach_001', NOW() - INTERVAL '30 days', 100, NOW(), NOW()),
('ua_005', 'student_002', 'ach_002', NOW() - INTERVAL '25 days', 100, NOW(), NOW()),
('ua_006', 'student_003', 'ach_001', NOW() - INTERVAL '60 days', 100, NOW(), NOW()),
('ua_007', 'student_003', 'ach_002', NOW() - INTERVAL '55 days', 100, NOW(), NOW()),
('ua_008', 'student_003', 'ach_004', NOW() - INTERVAL '20 days', 100, NOW(), NOW()),
('ua_009', 'teacher_001', 'ach_001', NOW() - INTERVAL '180 days', 100, NOW(), NOW()),
('ua_010', 'teacher_001', 'ach_006', NOW() - INTERVAL '90 days', 100, NOW(), NOW());

-- =============================================
-- SUBSCRIPTIONS
-- =============================================

INSERT INTO subscriptions (
    id, user_id, plan, status, start_date, end_date, auto_renew, payment_method,
    created_at, updated_at
) VALUES 
('sub_admin', 'admin_001', 'ENTERPRISE', 'ACTIVE', NOW() - INTERVAL '365 days', NOW() + INTERVAL '365 days', true, 'card', NOW(), NOW()),
('sub_teacher', 'teacher_001', 'PREMIUM', 'ACTIVE', NOW() - INTERVAL '180 days', NOW() + INTERVAL '180 days', true, 'card', NOW(), NOW()),
('sub_student1', 'student_001', 'BASIC', 'ACTIVE', NOW() - INTERVAL '45 days', NOW() + INTERVAL '45 days', false, 'card', NOW(), NOW()),
('sub_student2', 'student_002', 'FREE', 'ACTIVE', NOW() - INTERVAL '30 days', NULL, false, NULL, NOW(), NOW()),
('sub_student3', 'student_003', 'PREMIUM', 'ACTIVE', NOW() - INTERVAL '60 days', NOW() + INTERVAL '60 days', true, 'card', NOW(), NOW());

-- =============================================
-- SAMPLE CASES
-- =============================================

INSERT INTO cases (
    id, uuid, title, description, facts, legal_issues, applicable_laws, difficulty,
    legal_domain, tags, status, created_by, created_at, updated_at
) VALUES 
('case_001', 'uuid_case_001',
'Shartnoma majburiyatlarini buzish',
'Kompaniya tomonidan yetkazib berish shartnomasidagi majburiyatlar bajarmaganligi toʻgʻrisida daʼvo',
'"ABC" MChJ bilan "XYZ" kompaniyasi oʻrtasida 2023-yil 1-martda 100 000 dollarlik mahsulot yetkazib berish shartnomasi tuzilgan. Shartnomaga koʻra, "ABC" MChJ 2023-yil 1-aprelgacha mahsulotlarni yetkazib berishi kerak edi. Biroq, kompaniya muddatidan 2 hafta oʻtib, faqat 60% mahsulot yetkazib berdi. "XYZ" kompaniyasi zarar koʻrganligini daʼvo qilib, sudga murojaat qildi.',
'1. Shartnoma majburiyatlarini buzishning oqibatlari nima? 2. Zarar miqdorini qanday hisoblash mumkin? 3. Shartnomaning bekor qilinishi mumkinmi?',
ARRAY['357-modda', '365-modda', '369-modda'],
'medium',
'civil',
ARRAY['shartnoma', 'majburiyat', 'buzish', 'zarar'],
'active',
'teacher_001',
NOW(),
NOW()),

('case_002', 'uuid_case_002',
'Ijara munosabatlari',
'Ijarachi tomonidan ijaraga olingan xonadanni toʻgʻri foydalanmaganligi toʻgʻrisida daʼvo',
'Karimov Toshkent shahridan 2 xonali kvartirani ijaraga oldi. Ijara shartnomasiga koʻra, u kvartirani faqat yashash uchun foydalanishi kerak edi. Biroq, Karimov kvartirada ishlab chiqarish faoliyatini yoʻlga qoʻydi, qoʻshnilar shikoyat qildi. Ijarachi bu harakatlari uchun javob bermadi.',
'1. Ijara obʼektining maqsadga muvofiqligi qanday belgilanadi? 2. Ijarachining majburiyatlari nimalardan iborat? 3. Ijara shartnomasini bekor qilish asoslari',
ARRAY['635-modda', '637-modda', '639-modda'],
'easy',
'civil',
ARRAY['ijara', 'kvartira', 'foydalanish', 'buzish'],
'active',
'teacher_001',
NOW(),
NOW());

-- =============================================
-- INDEX CREATION FOR PERFORMANCE
-- =============================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_xp ON users(xp);
CREATE INDEX IF NOT EXISTS idx_users_level ON users(level);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Laws table indexes
CREATE INDEX IF NOT EXISTS idx_laws_code_name ON laws(code_name);
CREATE INDEX IF NOT EXISTS idx_laws_legal_domain ON laws(legal_domain);
CREATE INDEX IF NOT EXISTS idx_laws_importance ON laws(importance_level);
CREATE INDEX IF NOT EXISTS idx_laws_difficulty ON laws(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_laws_tags ON laws USING GIN(tags);

-- Court decisions table indexes
CREATE INDEX IF NOT EXISTS idx_court_decisions_case_number ON court_decisions(case_number);
CREATE INDEX IF NOT EXISTS idx_court_decisions_legal_domain ON court_decisions(legal_domain);
CREATE INDEX IF NOT EXISTS idx_court_decisions_precedent_value ON court_decisions(precedent_value);
CREATE INDEX IF NOT EXISTS idx_court_decisions_featured ON court_decisions(is_featured);
CREATE INDEX IF NOT EXISTS idx_court_decisions_tags ON court_decisions USING GIN(tags);

-- Legal dictionary table indexes
CREATE INDEX IF NOT EXISTS idx_legal_dictionary_term ON legal_dictionary(term);
CREATE INDEX IF NOT EXISTS idx_legal_dictionary_category ON legal_dictionary(category);
CREATE INDEX IF NOT EXISTS idx_legal_dictionary_synonyms ON legal_dictionary USING GIN(synonyms);

-- Cases table indexes
CREATE INDEX IF NOT EXISTS idx_cases_legal_domain ON cases(legal_domain);
CREATE INDEX IF NOT EXISTS idx_cases_difficulty ON cases(difficulty);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_tags ON cases USING GIN(tags);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_laws_fulltext ON laws USING GIN(to_tsvector('uzbek', title || ' ' || full_text || ' ' || summary));
CREATE INDEX IF NOT EXISTS idx_court_decisions_fulltext ON court_decisions USING GIN(to_tsvector('uzbek', title || ' ' || decision || ' ' || reasoning));
CREATE INDEX IF NOT EXISTS idx_legal_dictionary_fulltext ON legal_dictionary USING GIN(to_tsvector('uzbek', term || ' ' || definition || ' ' || explanation));

-- =============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Update user last_active_at on login
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users 
    SET last_active_at = NOW() 
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user activity
CREATE TRIGGER trigger_update_last_active
    AFTER INSERT ON activity_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_last_active();

-- Update legal_dictionary last_updated on modification
CREATE OR REPLACE FUNCTION update_dictionary_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE legal_dictionary 
    SET last_updated = NOW() 
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_dictionary_timestamp
    AFTER UPDATE ON legal_dictionary
    FOR EACH ROW
    EXECUTE FUNCTION update_dictionary_timestamp();

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- User statistics view
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.xp,
    u.level,
    u.streak,
    u.total_cases,
    u.win_rate,
    COUNT(ua.id) as achievement_count,
    COUNT(ai.id) as ai_interactions_count,
    MAX(al.timestamp) as last_activity
FROM users u
LEFT JOIN user_achievements ua ON u.id = ua.user_id
LEFT JOIN ai_interactions ai ON u.id = ai.user_id
LEFT JOIN activity_logs al ON u.id = al.user_id
GROUP BY u.id, u.name, u.email, u.xp, u.level, u.streak, u.total_cases, u.win_rate;

-- Popular laws view
CREATE OR REPLACE VIEW popular_laws AS
SELECT 
    l.id,
    l.title,
    l.code_name,
    l.article_number,
    l.legal_domain,
    l.importance_level,
    COUNT(lcd.court_decision_id) as precedent_count,
    AVG(lcd.relevance_score) as avg_relevance
FROM laws l
LEFT JOIN law_court_decisions lcd ON l.id = lcd.law_id
GROUP BY l.id, l.title, l.code_name, l.article_number, l.legal_domain, l.importance_level
ORDER BY precedent_count DESC, avg_relevance DESC;

-- Recent court decisions view
CREATE OR REPLACE VIEW recent_decisions AS
SELECT 
    cd.id,
    cd.title,
    cd.case_number,
    cd.court_name,
    cd.decision_date,
    cd.legal_domain,
    cd.precedent_value,
    COUNT(l.law_id) as related_laws_count
FROM court_decisions cd
LEFT JOIN law_court_decisions lcd ON cd.id = lcd.court_decision_id
LEFT JOIN laws l ON lcd.law_id = l.id
GROUP BY cd.id, cd.title, cd.case_number, cd.court_name, cd.decision_date, cd.legal_domain, cd.precedent_value
ORDER BY cd.decision_date DESC;

COMMIT;
