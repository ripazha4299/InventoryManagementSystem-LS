# Product Requirements Document (PRD)

College Sports Club – Inventory Management System

## 1. Purpose
The purpose of this system is to enable the College Sports Club to efficiently manage and track all sports equipment, keys, categories, and their movement across locations and users. It ensures transparency, accountability, and ease of access while maintaining a complete audit trail of equipment lifecycle.

## 2. Primary Users
- Sports Club Representatives (Admins): Approved users with access to create, update, and manage the entire system.
- General Students (Future Scope): Not included in this release; only authorized admins can log in.

## 3. Key Features
3.1 User Authentication
- Only approved email IDs can access the system.

3.2 Home / Landing Page
- Switch between: View by Sport Category & View All Products (Alphabetical List)
- Ability to Add New Product, Delete Product, Search Items.

3.3 Sports & Category Management
- Add new sport categories.
- Each product linked to a sport category.

3.4 Product-Level Listing Page
- Shows all items under selected sport category.
- Displays item age, current status, last user, etc.

3.5 Item Detail Page
- Complete detail with location, history, last updated by, etc.

3.6 Change Status Workflow
- Update location, person holding the item, notes, and save.

3.7 Equipment Lifecycle Management
- Create, Read, Update, Delete lifecycle for all items.

3.8 Deleted Items Archive
- Stores previously discarded items with full history.

3.9 Inventory Key Tracking
- Track chain of custody of Inventory Room Key.

3.10 Download Inventory Snapshot (Excel Export)
- System provides a button to download Excel sheet.
- Snapshot contains item name, sport, current status, last used by, age, and grouping by sport.

## 4. Non‑Functional Requirements
- Support 300–400 users.
- Mobile-friendly responsive UI.
- Fast filtering and searching.
- Strong data consistency and accuracy of item history.

## 5. Success Metrics
- 100% traceability of equipment.
- Reduced lost or damaged items.
- Faster access to inventory keys.
- Increased operational transparency.
