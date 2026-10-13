# MediQ — MongoDB Database Schema & Collections Reference

MediQ uses **MongoDB** with **Mongoose** models for schema enforcement, validation, indexing, and scalable document storage.

---

## 1. Database Collections

### `hospitals`
- `id` (String, Unique) — Hospital identifier (e.g., `hosp-1`)
- `name` (String) — Full facility name
- `location` (String) — Neighborhood / Area
- `city` (String) — City name (indexed)
- `address` (String) — Street address
- `specialties` (Array of Strings) — Medical specialties offered
- `avg_consultation_minutes` (Number) — Default average OPD duration
- `rating` (Number) — Patient satisfaction rating
- `created_at` (Date) — Timestamp

### `departments`
- `id` (String, Unique) — Department identifier (e.g., `dept-1`)
- `hospital_id` (String, Indexed) — Foreign reference to hospital
- `name` (String) — Department name (e.g., `Cardiology`)
- `doctor_name` (String) — Assigned attending doctor
- `avg_time_minutes` (Number) — Department-specific consultation duration
- `room_no` (String) — Physical OPD room number
- `is_paused` (Boolean) — Queue pause switch for breaks/meetings
- `pause_reason` (String) — Reason displayed to waiting patients

### `users`
- `id` (String, Unique) — User identifier (e.g., `user-1`)
- `full_name` (String) — Full legal name
- `email` (String, Unique, Lowercase, Indexed) — Auth email
- `phone` (String) — Primary contact number
- `role` (String, Enum) — `'patient' | 'receptionist' | 'doctor' | 'admin'`
- `password` (String) — Password hash / credential

### `doctors`
- `id` (String, Unique) — Doctor identifier (e.g., `doc-1`)
- `hospital_id` (String, Indexed)
- `department_id` (String, Indexed)
- `user_id` (String) — Linked auth account
- `name` (String) — Doctor name
- `specialty` (String) — Clinical specialty
- `status` (String, Enum) — `'AVAILABLE' | 'ON_BREAK' | 'UNAVAILABLE' | 'IN_OPD'`
- `room_no` (String) — OPD room number

### `tokens`
- `id` (String, Unique) — Token identifier (e.g., `tok-1700000000`)
- `token_number` (String, Indexed) — Sequential OPD token number (e.g., `101`)
- `ref_id` (String, Unique, Indexed) — QR code and receipt reference (e.g., `REF-MEDIQ-101-DEPT1`)
- `patient_id` (String, Indexed) — Patient user ID or walk-in ID
- `patient_name` (String)
- `patient_phone` (String)
- `patient_type` (String, Enum) — `'online' | 'walkin'`
- `hospital_id` (String, Indexed)
- `department_id` (String, Indexed)
- `status` (String, Enum, Indexed) — `'waiting' | 'called' | 'in_consultation' | 'completed' | 'no_show' | 'cancelled'`
- `priority` (String, Enum, Indexed) — `'NORMAL' | 'PRIORITY' | 'EMERGENCY'`
- `priority_reason` (String)
- `intent_status` (String, Enum) — `'waiting' | 'on_my_way' | 'arrived' | 'cant_come'`
- `notes` (String) — Chief complaint or receptionist triage notes
- `created_at` (Date)
- `called_at` (Date)
- `consultation_started_at` (Date)
- `completed_at` (Date)
- `consultation_duration_minutes` (Number)

### `patient_files`
- `id` (String, Unique)
- `patient_id` (String, Unique, Indexed) — Patient user ID
- `patient_code` (String, Unique, Indexed) — Medical Record Number (MRN) (e.g., `MED1024`)
- `full_name` (String)
- `phone` (String)
- `age` (Number)
- `gender` (String)
- `blood_group` (String)
- `allergies` (String)
- `chronic_conditions` (String)

### `consultations`
- `id` (String, Unique)
- `patient_id` (String, Indexed)
- `doctor_id` (String, Indexed)
- `doctor_name` (String)
- `queue_token_id` (String)
- `token_number` (String)
- `department_id` (String)
- `department_name` (String)
- `hospital_id` (String)
- `hospital_name` (String)
- `visit_date` (Date)
- `chief_complaint` (String)
- `symptoms` (String)
- `observations` (String)
- `diagnosis` (String)
- `treatment_advice` (String)
- `prescription_notes` (String)
- `follow_up_instructions` (String)
- `additional_remarks` (String)

### `audit_logs`
- `id` (String, Unique)
- `user_id` (String)
- `user_name` (String)
- `user_role` (String)
- `action` (String)
- `token_id` (String)
- `token_number` (String)
- `previous_status` (String)
- `new_status` (String)
- `details` (String)
- `timestamp` (Date)

---

## 2. Running Seeding Script

To initialize MongoDB with initial hospitals, departments, duty rosters, and demo users:

```bash
npm run seed --prefix server
```
