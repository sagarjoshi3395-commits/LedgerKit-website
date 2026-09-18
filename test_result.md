#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Replace the SuperProfile external checkout links with a native Razorpay checkout for collecting payments on the digital-product storefront."

backend:
  - task: "Razorpay create-order endpoint (POST /api/checkout/create-order)"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "New endpoint accepts items[] (product_slug + edition). Computes total server-side from DB prices (never trusts client). Creates a Razorpay order via razorpay SDK using RAZORPAY_KEY_ID/SECRET from env. Stores an Order doc (status payment_pending, provider razorpay, items[], razorpay_order_id, amount). Returns order_id, razorpay_order_id, amount(paise), display_amount, currency, key_id, name, description, items. Manually verified with curl for single item (299 -> 29900 paise) and multi item (299+199 -> 49800 paise) using LIVE keys — Razorpay order IDs returned successfully. Needs formal testing for edge cases: unknown slug (404), unknown edition (400), empty items (400)."
        - working: true
          agent: "testing"
          comment: "Comprehensive testing completed via backend_test.py. All 6 test scenarios passed: (1) Single item order (meta-ads-decode) correctly returns 200 with razorpay_order_id starting 'order_', amount=29900 paise, display_amount=299, currency=INR, key_id starting 'rzp_live_', items length=1. (2) Multi-item order (meta-ads-decode + ai-business-ideas-2026) correctly calculates server-side total: amount=49800 paise, display_amount=498, items length=2. (3) Bundle order (complete-business-bundle) correctly returns amount=49900 paise, display_amount=499. (4) Unknown slug 'does-not-exist' correctly returns 404 with error message. (5) Unknown edition 'physical' for meta-ads-decode correctly returns 400 with error message. (6) Empty items array correctly returns 400 with 'No items to check out' error. All validations passed, endpoint is working correctly with LIVE Razorpay keys."
  - task: "Razorpay verify endpoint (POST /api/checkout/verify)"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Verifies razorpay signature via client.utility.verify_payment_signature. On success marks order paid + stores razorpay_payment_id + paid_at. On SignatureVerificationError marks order payment_failed and returns 400. Returns 404 if order_id+razorpay_order_id pair not found. Needs testing: invalid signature must return 400 and NOT mark order paid; unknown order returns 404. IMPORTANT: do NOT attempt a real successful payment (LIVE keys = real money) — only test the failure/rejection paths and order lookup."
        - working: true
          agent: "testing"
          comment: "Comprehensive testing completed via backend_test.py. Both test scenarios passed: (1) Bogus signature test: Created a real order (ORD-55858CD125, razorpay_order_id: order_TdayZdejZbugVf), attempted verification with fake payment_id 'pay_FAKE123' and bogus signature 'deadbeefbogussignature'. Endpoint correctly returned 400 with 'Payment signature verification failed' error. Verified via GET /api/orders/{order_id} that order status was correctly set to 'payment_failed' (NOT 'paid'). (2) Unknown order test: Attempted verification with non-existent order_id 'ORD-UNKNOWN' and razorpay_order_id 'order_UNKNOWN', endpoint correctly returned 404 with 'Order not found' error. All security validations working correctly. NO real payments were completed during testing (LIVE keys protected)."

frontend:
  - task: "Razorpay checkout on all buy buttons (CheckoutButton, StickyBuyBar, PricingEditions)"
    implemented: true
    working: "NA"
    file: "frontend/src/lib/razorpay.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "New lib/razorpay.js loads checkout.js, calls /checkout/create-order, opens Razorpay modal, verifies via /checkout/verify, redirects to /order-success?order_id=. All 3 buy paths rewired away from SuperProfile redirects. NOT yet tested via UI — LIVE keys mean a completed payment charges real money, so frontend payment testing is DEFERRED pending explicit user permission."

metadata:
  created_by: "main_agent"
  version: "1.2"
  test_sequence: 2
  run_ui: false

test_plan:
  current_focus:
    - "Razorpay create-order endpoint (POST /api/checkout/create-order)"
    - "Razorpay verify endpoint (POST /api/checkout/verify)"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    - agent: "main"
      message: "Please test the two new Razorpay backend endpoints ONLY. These use LIVE Razorpay keys, so DO NOT complete any real payment. Safe tests: (1) POST /api/checkout/create-order with valid single item {items:[{product_slug:'meta-ads-decode',edition:'digital'}]} -> expect 200 with razorpay_order_id starting 'order_', amount 29900, key_id present. (2) Multi-item bundle math (meta-ads-decode + ai-business-ideas-2026 -> 49800). (3) Edge cases: unknown slug -> 404; unknown edition -> 400; empty items -> 400. (4) POST /api/checkout/verify with a bogus signature for a real created order_id/razorpay_order_id -> expect 400 signature failure and the order must NOT be marked paid (GET /api/orders/{order_id} should still be payment_failed, not paid). (5) verify with unknown order_id -> 404. Do NOT call Razorpay to simulate a successful capture."
    - agent: "testing"
      message: "Backend testing completed successfully. Created comprehensive backend_test.py with 8 test scenarios covering all requirements. All tests passed (8/8): ✅ Single item order creation (₹299 -> 29900 paise), ✅ Multi-item order with server-side total calculation (₹299+₹199 -> 49800 paise), ✅ Bundle order (₹499 -> 49900 paise), ✅ Unknown slug returns 404, ✅ Unknown edition returns 400, ✅ Empty items returns 400, ✅ Bogus signature verification returns 400 and marks order as 'payment_failed' (NOT 'paid'), ✅ Unknown order verification returns 404. Both Razorpay endpoints are working correctly with LIVE keys. NO real payments were completed during testing. Both backend tasks marked as working=true, needs_retesting=false."

