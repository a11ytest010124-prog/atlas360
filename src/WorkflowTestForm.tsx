import { useState, type FormEvent } from "react"

type WorkflowTestFormProps = {
  onBack: () => void
  onSubmit: (scenario: string, details: string) => void
}

const scenarios = [
  "Create a customized test order",
  "Create a sample test order",
  "Create and Fulfil the test order",
  "Fulfil the test order completely",
  "Cancel test order",
  "Web dashboard UI Sanity Check",
  "DCP UI validation",
  "Verify the order in Acupick dashboard",
] as const

type Scenario = typeof scenarios[number]
const field =
  "w-full min-h-10 rounded-lg border border-[#DDE3E9] bg-white px-3 py-2 text-[13px] text-[#17233D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#003B70]"
const label = "flex flex-col gap-1.5 text-[12px] font-semibold text-[#34445C]"

export function WorkflowTestForm({ onBack, onSubmit }: WorkflowTestFormProps) {
  const [scenario, setScenario] = useState<Scenario | "">("")
  const [environment, setEnvironment] = useState("QA2")
  const [values, setValues] = useState<Record<string, string>>({
    userType: "Regular",
    slotType: "Regular",
    storeNumber: "3132",
    paymentType: "Credit Card",
    bagPreference: "Yes",
    quantity: "1",
    storeSettings: "Regular",
  })
  const [advanced, setAdvanced] = useState(false)
  const [error, setError] = useState("")
  const update = (key: string, value: string) => {
    setValues((old) => ({ ...old, [key]: value }))
    setError("")
  }
  const select = (
    key: string,
    title: string,
    options: string[],
    required = false,
  ) => (
    <label className={label} key={key}>
      {title}
      {required ? " *" : ""}
      <select
        className={field}
        value={values[key] ?? ""}
        onChange={(e) => update(key, e.target.value)}
        required={required}
      >
        <option value="">Select {title.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
  const input = (
    key: string,
    title: string,
    required = false,
    type = "text",
  ) => (
    <label className={label} key={key}>
      {title}
      {required ? " *" : ""}
      <input
        className={field}
        type={type}
        value={values[key] ?? ""}
        onChange={(e) => update(key, e.target.value)}
        required={required}
        placeholder={`Enter ${title.toLowerCase()}`}
      />
    </label>
  )
  const isCustom = scenario === scenarios[0] || scenario === scenarios[2]
  const isSample = scenario === scenarios[1]
  const isOrder =
    scenario === scenarios[3] ||
    scenario === scenarios[4] ||
    scenario === scenarios[7]
  const isStore = scenario === scenarios[5]
  const isDcp = scenario === scenarios[6]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!scenario) {
      setError("Select a request type.")
      return
    }
    if (
      isCustom &&
      (!values.deliveryType || !values.itemType || !values.quantity)
    ) {
      setError("Delivery type, item type, and quantity are required.")
      return
    }
    if (isSample && !values.sampleOrderType) {
      setError("Select a sample order type.")
      return
    }
    if (isOrder && !values.orderNumber?.trim()) {
      setError("Order number is required.")
      return
    }
    if (scenario === scenarios[4] && !values.cancelledBy) {
      setError("Select who initiated cancellation.")
      return
    }
    if (isDcp && !values.dcpEnvironment) {
      setError("Select the DCP environment.")
      return
    }
    // Only fields relevant to the chosen scenario are recorded. Never include credentials.
    const keys = isCustom
      ? [
          "userType",
          "deliveryType",
          "slotType",
          "storeNumber",
          "itemType",
          "quantity",
          "individualItemType",
          "storageZone",
          "storeSettings",
          "paymentType",
          "bagPreference",
          "userEmail",
        ]
      : isSample
        ? ["sampleOrderType", "userEmail"]
        : isOrder
          ? [
              "orderNumber",
              ...(scenario === scenarios[4] ? ["cancelledBy"] : []),
            ]
          : isStore
            ? ["storeNumber"]
            : isDcp
              ? ["dcpEnvironment"]
              : []
    const payload = Object.fromEntries(
      keys.filter((key) => values[key]).map((key) => [key, values[key]]),
    )
    onSubmit(
      scenario,
      `Environment: ${environment} | Configuration: ${JSON.stringify(payload)}`,
    )
  }

  return (
    <div className="min-h-[75vh] pb-12">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-[13px] font-semibold text-[#00539B] hover:underline"
      >
        ← Back to Request Center
      </button>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#778198]">
        Request Center / Workflow Test
      </p>
      <h1 className="mt-2 text-[28px] font-bold tracking-[-0.035em] text-[#13203D] sm:text-[34px]">
        Configure Your Test Run
      </h1>
      <p className="mb-7 mt-2 text-[13px] text-[#667085]">
        Select a scenario and configure the relevant test parameters.
      </p>
      <form
        onSubmit={submit}
        className="max-w-[1000px] overflow-hidden rounded-xl border border-[#DDE3E9] bg-white shadow-sm"
      >
        <div className="border-b border-[#E9EDF1] px-6 py-5">
          <h2 className="text-[17px] font-bold text-[#17233D]">
            Request Configuration
          </h2>
        </div>
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <label className={label}>
            Environment *
            <select
              className={field}
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
            >
              <option value="QA2">QA2</option>
              <option disabled value="QA1">
                QA1 (unavailable)
              </option>
            </select>
          </label>
          <label className={label}>
            Request Type *
            <select
              className={field}
              value={scenario}
              required
              onChange={(e) => {
                setScenario(e.target.value as Scenario)
                setValues({
                  userType: "Regular",
                  slotType: "Regular",
                  storeNumber: "3132",
                  paymentType: "Credit Card",
                  bagPreference: "Yes",
                  quantity: "1",
                  storeSettings: "Regular",
                })
                setError("")
              }}
            >
              <option value="">Choose a test scenario</option>
              {scenarios.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          {!scenario && (
            <p className="rounded-lg bg-[#F4F8FC] p-4 text-[12px] text-[#526174] sm:col-span-2">
              Select a test scenario to display its configuration fields.
            </p>
          )}
          {isCustom && (
            <>
              {select("userType", "User Type", [
                "Regular",
                "FreshPass",
                "Business",
              ])}
              {select("deliveryType", "Delivery Type", ["DUG", "3PL"], true)}
              {select("slotType", "Slot Type", [
                "Regular",
                "Premium",
                "Doordash",
                "Express",
                "Flash",
              ])}
              {select("storeNumber", "Store Number", ["3132", "1502"])}
              {select(
                "itemType",
                "Item Type",
                [
                  "Regular Items",
                  "MTO Items",
                  "Priced Items",
                  "Weighted Items",
                ],
                true,
              )}
              {select("quantity", "Quantity", ["1", "2", "3", "4", "5"], true)}
              {select("paymentType", "Payment Type", ["Credit Card"])}
              {select("bagPreference", "Bag Preference", ["Yes", "No"])}
            </>
          )}
          {isSample &&
            select("sampleOrderType", "Order Type", ["DUG", "Delivery"], true)}
          {isOrder && input("orderNumber", "Order Number", true)}
          {scenario === scenarios[4] &&
            select(
              "cancelledBy",
              "Cancelled By",
              ["Customer", "Acupick/Store"],
              true,
            )}
          {isStore && select("storeNumber", "Store Number", ["3132", "1502"])}
          {isDcp &&
            select(
              "dcpEnvironment",
              "Target Environment",
              ["QA2", "Prod"],
              true,
            )}
          {(isCustom || isSample) && (
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => setAdvanced((old) => !old)}
                aria-expanded={advanced}
                className="text-[12px] font-bold text-[#00539B] hover:underline"
              >
                {advanced ? "▾" : "▸"} Advanced options (optional)
              </button>
              {advanced && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {isCustom && (
                    <>
                      {input("individualItemType", "Individual Item Type")}
                      {select("storageZone", "Storage Zone", [
                        "AM",
                        "FZ",
                        "HT",
                        "CH",
                      ])}
                      {select("storeSettings", "Store Settings", [
                        "Regular",
                        "Rolling Picklist",
                        "Dynamic Batching",
                        "Sector Batching",
                        "Tote label preprinting",
                        "Rolling Picklist + Tote label Preprinting",
                        "Sector Batching + Tote label Preprinting",
                        "Dynamic Batching + Tote label Preprinting",
                      ])}
                    </>
                  )}
                  {input("userEmail", "Test User Email", false, "email")}
                  <p className="text-[11px] text-[#667085] sm:col-span-2">
                    Passwords and other secrets should be provided through a
                    secure backend integration, not stored in request history.
                  </p>
                </div>
              )}
            </div>
          )}
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-[#FFF1F0] p-3 text-[12px] text-[#A12622] sm:col-span-2"
            >
              {error}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-[#E9EDF1] bg-[#FBFCFD] px-6 py-5">
          <span className="text-[11px] text-[#667085]">* Required fields</span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setScenario("")
                setValues({})
                setError("")
              }}
              className="rounded-lg border border-[#DDE3E9] bg-white px-4 py-2 text-[12px] font-semibold text-[#34445C]"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#003B70] px-4 py-2 text-[12px] font-bold text-white hover:bg-[#00539B]"
            >
              Submit Request
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
