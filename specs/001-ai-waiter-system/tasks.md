# Tasks: AI Waiter System

**Input**: Design documents from `/specs/001-ai-waiter-system/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included as requested in the specification for acceptance criteria validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan (backend/, frontend/, tests/)
- [ ] T002 Initialize Node.js/TypeScript project with package.json and dependencies
- [ ] T003 [P] Configure ESLint, Prettier, and TypeScript configs
- [ ] T004 [P] Setup environment configuration (.env templates, config validation)
- [ ] T005 [P] Create .gitignore, .dockerignore files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Setup PostgreSQL database schema and migrations framework
- [ ] T007 Setup Redis connection and session management
- [ ] T008 [P] Implement Express.js API routing and middleware structure
- [ ] T009 [P] Create base database models/entities (Customer, MenuItem, Order, Conversation, Payment, Restaurant, Feedback)
- [ ] T010 Configure error handling and logging infrastructure
- [ ] T011 [P] Setup OpenAI API client and conversation service foundation
- [ ] T012 [P] Setup Stripe payment service foundation
- [ ] T013 [P] Configure CORS, security headers, and API middleware
- [ ] T014 Setup testing framework (Jest) and basic test utilities

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Menu Exploration & Ordering (Priority: P1) 🎯 MVP

**Goal**: Core conversational AI that can discuss menu items, take orders, and confirm selections

**Independent Test**: Customer can access web interface, have conversation about menu, place order, receive confirmation

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T015 [P] [US1] Contract test for conversation endpoints in backend/tests/contract/conversation.test.js
- [ ] T016 [P] [US1] Contract test for menu endpoints in backend/tests/contract/menu.test.js
- [ ] T017 [P] [US1] Contract test for order endpoints in backend/tests/contract/order.test.js
- [ ] T018 [P] [US1] Integration test for menu exploration flow in backend/tests/integration/menu-exploration.test.js
- [ ] T019 [P] [US1] Integration test for basic ordering flow in backend/tests/integration/basic-ordering.test.js

### Backend Implementation for User Story 1

- [ ] T020 [P] [US1] Implement Customer model in backend/src/models/customer.js
- [ ] T021 [P] [US1] Implement MenuItem model in backend/src/models/menu-item.js
- [ ] T022 [P] [US1] Implement Order model in backend/src/models/order.js
- [ ] T023 [P] [US1] Implement Conversation model in backend/src/models/conversation.js
- [ ] T024 [US1] Implement conversation AI service in backend/src/services/conversation-ai.js (depends on T023)
- [ ] T025 [US1] Implement menu service in backend/src/services/menu.js (depends on T021)
- [ ] T026 [US1] Implement order service in backend/src/services/order.js (depends on T022)
- [ ] T027 [US1] Create conversation API routes in backend/src/api/routes/conversation.js
- [ ] T028 [US1] Create menu API routes in backend/src/api/routes/menu.js
- [ ] T029 [US1] Create order API routes in backend/src/api/routes/order.js
- [ ] T030 [US1] Create session management API routes in backend/src/api/routes/sessions.js
- [ ] T031 [US1] Add validation and error handling for conversation endpoints

### Frontend Implementation for User Story 1

- [ ] T032 [P] [US1] Create conversation interface component in frontend/src/components/chat/ConversationInterface.tsx
- [ ] T033 [P] [US1] Create menu display components in frontend/src/components/menu/MenuDisplay.tsx
- [ ] T034 [P] [US1] Create order summary component in frontend/src/components/order/OrderSummary.tsx
- [ ] T035 [US1] Implement API client service in frontend/src/services/api-client.js
- [ ] T036 [US1] Create main customer page in frontend/src/pages/customer/CustomerPage.tsx
- [ ] T037 [US1] Setup state management for conversation and order state
- [ ] T038 [P] [US1] Add responsive CSS and mobile-first design
- [ ] T039 [P] [US1] Component tests for conversation interface in frontend/tests/component/conversation.test.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Personalized Recommendations & Upselling (Priority: P2)

**Goal**: AI analyzes preferences and provides intelligent suggestions to increase order value

**Independent Test**: Customer enters dietary preferences, receives relevant suggestions, experiences contextual upselling

### Tests for User Story 2 ⚠️

- [ ] T040 [P] [US2] Contract test for recommendation endpoints in backend/tests/contract/recommendations.test.js
- [ ] T041 [P] [US2] Integration test for dietary filtering in backend/tests/integration/dietary-recommendations.test.js
- [ ] T042 [P] [US2] Integration test for upselling logic in backend/tests/integration/upselling.test.js

### Implementation for User Story 2

- [ ] T043 [P] [US2] Enhance Customer model with preference tracking in backend/src/models/customer.js
- [ ] T044 [US2] Implement recommendation engine service in backend/src/services/recommendation.js
- [ ] T045 [US2] Create recommendation API routes in backend/src/api/routes/recommendations.js
- [ ] T046 [US2] Enhance conversation AI with recommendation logic in backend/src/services/conversation-ai.js
- [ ] T047 [P] [US2] Create dietary preferences component in frontend/src/components/customer/DietaryPreferences.tsx
- [ ] T048 [P] [US2] Create recommendation display component in frontend/src/components/menu/RecommendationsList.tsx
- [ ] T049 [US2] Integrate recommendations into conversation flow

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Split Payment Processing (Priority: P3)

**Goal**: Handle multiple payment methods and split billing for group dining

**Independent Test**: Multiple customers split bills, use different payment methods, receive individual receipts

### Tests for User Story 3 ⚠️

- [ ] T050 [P] [US3] Contract test for payment endpoints in backend/tests/contract/payment.test.js
- [ ] T051 [P] [US3] Integration test for split payment logic in backend/tests/integration/split-payments.test.js
- [ ] T052 [P] [US3] Integration test for multiple payment methods in backend/tests/integration/payment-methods.test.js

### Implementation for User Story 3

- [ ] T053 [P] [US3] Implement Payment model with split payment support in backend/src/models/payment.js
- [ ] T054 [US3] Implement payment processing service in backend/src/services/payment.js
- [ ] T055 [US3] Create payment API routes in backend/src/api/routes/payment.js
- [ ] T056 [US3] Integrate Stripe SDK for payment processing
- [ ] T057 [P] [US3] Create payment form component in frontend/src/components/payment/PaymentForm.tsx
- [ ] T058 [P] [US3] Create split payment interface in frontend/src/components/payment/SplitPayment.tsx
- [ ] T059 [US3] Implement payment flow integration with order completion

**Checkpoint**: All core user stories should now be independently functional

---

## Phase 6: User Story 4 - Real-time Order Tracking (Priority: P4)

**Goal**: Live updates on order status from kitchen integration

**Independent Test**: Orders show real-time status updates as they progress through kitchen workflow

### Tests for User Story 4 ⚠️

- [ ] T060 [P] [US4] Integration test for order status updates in backend/tests/integration/order-tracking.test.js
- [ ] T061 [P] [US4] WebSocket connection test in backend/tests/integration/websocket.test.js

### Implementation for User Story 4

- [ ] T062 [US4] Setup WebSocket server for real-time updates in backend/src/services/websocket.js
- [ ] T063 [US4] Implement POS integration service in backend/src/services/pos-integration.js
- [ ] T064 [US4] Create order tracking API routes in backend/src/api/routes/tracking.js
- [ ] T065 [P] [US4] Create order status component in frontend/src/components/order/OrderStatus.tsx
- [ ] T066 [US4] Implement WebSocket client for real-time updates in frontend

---

## Phase 7: Administrative Features

**Goal**: Restaurant staff dashboard and configuration

- [ ] T067 [P] [ADMIN] Create restaurant configuration model in backend/src/models/restaurant.js
- [ ] T068 [P] [ADMIN] Create feedback model in backend/src/models/feedback.js
- [ ] T069 [ADMIN] Implement admin dashboard API routes in backend/src/api/routes/admin.js
- [ ] T070 [P] [ADMIN] Create admin dashboard pages in frontend/src/pages/admin/
- [ ] T071 [P] [ADMIN] Create feedback collection component in frontend/src/components/feedback/FeedbackForm.tsx

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T072 [P] Add comprehensive error handling and user feedback
- [ ] T073 [P] Implement accessibility features (WCAG 2.1 AA compliance)
- [ ] T074 [P] Add voice input support using Web Speech API in frontend/src/services/speech.js
- [ ] T075 [P] Performance optimization and caching
- [ ] T076 [P] Security hardening and input validation
- [ ] T077 [P] Add logging and monitoring integration
- [ ] T078 [P] Documentation updates and API documentation
- [ ] T079 Run quickstart.md validation and deployment testing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Admin Features (Phase 7)**: Can run parallel with user stories
- **Polish (Phase 8)**: Depends on core user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May enhance US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1 order completion
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Enhances US1 order tracking

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before API routes
- Backend API before frontend integration
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Frontend and backend tasks for same story can run in parallel if APIs are defined

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### API-First Strategy (as requested)

Since user requested starting with APIs:
1. Complete Setup + Foundational phases
2. Focus on backend API implementation first for each user story
3. Create contract tests to validate API behavior
4. Then implement frontend components that consume the APIs

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- API-first approach: backend routes and services before frontend components