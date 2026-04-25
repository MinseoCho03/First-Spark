const oecd = window.OECD_DATA || {};

const projects = [
  {
    id: "offline-learning-ghana",
    title: "Offline-first learning app for rural schools",
    country: "Ghana",
    region: "West Africa",
    sector: "Education",
    subsector: "Digital learning / rural education",
    beneficiaries: "Rural students",
    stage: "Prototype",
    fundingNeed: "$10,000",
    readiness: "Pilot-oriented prototype",
    readinessFilter: "Pilot-oriented",
    opportunityGap: "Medium-High",
    verification: "Self-reported",
    description:
      "A young builder in Ghana is building an offline-first learning app for rural schools where students have limited internet access.",
  },
  {
    id: "maternal-health-india",
    title: "Digital maternal health triage tool",
    country: "India",
    region: "South Asia",
    sector: "Health",
    subsector: "Maternal health / digital health",
    beneficiaries: "Rural clinics and pregnant women",
    stage: "Pilot-ready",
    fundingNeed: "$25,000",
    readiness: "Pilot-ready",
    readinessFilter: "Pilot-ready",
    opportunityGap: "High",
    verification: "Self-reported",
    description:
      "A student-led team is building a digital triage tool to help rural clinics identify maternal health risks earlier.",
  },
  {
    id: "sms-climate-kenya",
    title: "SMS climate alert system for smallholder farmers",
    country: "Kenya",
    region: "East Africa",
    sector: "Climate / Agriculture",
    subsector: "Climate adaptation / farmer advisory",
    beneficiaries: "Smallholder farmers",
    stage: "Prototype",
    fundingNeed: "$15,000",
    readiness: "Early pilot",
    readinessFilter: "Pilot-oriented",
    opportunityGap: "Medium",
    verification: "Self-reported",
    description:
      "A young team is building an SMS alert system that sends localized climate and crop-risk information to smallholder farmers.",
  },
  {
    id: "water-quality-nigeria",
    title: "Community water quality reporting tool",
    country: "Nigeria",
    region: "West Africa",
    sector: "Civic Tech / Health",
    subsector: "Water safety",
    beneficiaries: "Low-income communities",
    stage: "Idea",
    fundingNeed: "$8,000",
    readiness: "Early-stage",
    readinessFilter: "Early-stage",
    opportunityGap: "Medium",
    verification: "Self-reported",
    description:
      "A local youth team wants to build a mobile reporting system for community water quality issues.",
  },
  {
    id: "telemedicine-indonesia",
    title: "Low-cost telemedicine access kiosk",
    country: "Indonesia",
    region: "Southeast Asia",
    sector: "Health",
    subsector: "Rural healthcare access",
    beneficiaries: "Rural patients",
    stage: "Prototype",
    fundingNeed: "$18,000",
    readiness: "Pilot-oriented prototype",
    readinessFilter: "Pilot-oriented",
    opportunityGap: "Medium-High",
    verification: "Self-reported",
    description:
      "A young founder is prototyping a low-cost telemedicine kiosk for rural areas with limited clinic access.",
  },
];

const manualSector = [
  { label: "Education", count: 8 },
  { label: "Health", count: 6 },
  { label: "Climate", count: 4 },
  { label: "Agriculture", count: 3 },
  { label: "Civic Tech", count: 3 },
];

const manualRegion = [
  { label: "West Africa", count: 8 },
  { label: "South Asia", count: 6 },
  { label: "East Africa", count: 5 },
  { label: "Latin America", count: 5 },
];

const state = {
  page: "overview",
  selectedProjectId: "offline-learning-ghana",
  filters: {
    country: "All",
    sector: "All",
    stage: "All",
    readiness: "All",
    gap: "All",
    verification: "Self-reported",
  },
};

function $(selector, root = document) {
  return root.querySelector(selector);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function gapClass(value) {
  if (value === "High") return "red";
  if (value === "Medium-High") return "amber";
  if (value === "Medium") return "blue";
  return "green";
}

function compactNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function truncateText(value, limit = 210) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1).trim()}...`;
}

function barList(items, valueKey = "count") {
  const max = Math.max(...items.map((item) => item[valueKey] || 0), 1);
  return `<div class="bar-list">
    ${items
      .map((item) => {
        const value = item[valueKey] || 0;
        const width = Math.max(6, Math.round((value / max) * 100));
        const label = item.amountLabel || compactNumber(value);
        return `<div class="bar-row">
          <strong>${escapeHtml(item.label)}</strong>
          <div class="bar-track" aria-hidden="true"><div class="bar-fill" style="--value: ${width}%"></div></div>
          <span>${escapeHtml(label)}</span>
        </div>`;
      })
      .join("")}
  </div>`;
}

function kpi(label, value) {
  return `<article class="kpi"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`;
}

function projectCard(project, featured = false) {
  return `<article class="card project-card">
    <div>
      <h3>${escapeHtml(project.title)}</h3>
      <div class="meta">${escapeHtml(project.country)} · ${escapeHtml(project.sector)} · ${escapeHtml(project.stage)}</div>
    </div>
    <p>${escapeHtml(project.description)}</p>
    <div class="badge-row">
      <span class="badge blue">Readiness: ${escapeHtml(project.readiness)}</span>
      <span class="badge ${gapClass(project.opportunityGap)}">Gap: ${escapeHtml(project.opportunityGap)}</span>
      <span class="badge green">Verification: ${escapeHtml(project.verification)}</span>
    </div>
    <div class="card-footer">
      <span class="money">Funding Need: ${escapeHtml(project.fundingNeed)}</span>
      <button class="btn primary packet-btn" data-project-id="${escapeHtml(project.id)}">${featured ? "View Evaluation Packet" : "View Evaluation Packet"}</button>
    </div>
  </article>`;
}

function pageHeader(id, title, subtitle, description = "", actions = "") {
  return `<header class="page-header">
    <div>
      <div class="eyebrow">Opportunity Atlas</div>
      <h1 id="${id}">${escapeHtml(title)}</h1>
      <p class="lead">${escapeHtml(subtitle)}</p>
      ${description ? `<p class="lead">${escapeHtml(description)}</p>` : ""}
    </div>
    ${actions ? `<div class="badge-row">${actions}</div>` : ""}
  </header>`;
}

function renderOverview() {
  const featured = projects.slice(0, 3);
  $("#overview").innerHTML = `
    ${pageHeader(
      "overview-title",
      "Opportunity Atlas",
      "Discover overlooked young builders through their projects.",
      "Opportunity Atlas turns self-reported local projects into structured, funder-readable opportunity profiles, helping opportunity providers discover young builders beyond traditional credentials and networks.",
    )}
    <section class="grid four">
      ${kpi("Submitted Projects", "24")}
      ${kpi("Countries Represented", "9")}
      ${kpi("High Gap Projects", "7")}
      ${kpi("Pilot-Ready Projects", "5")}
    </section>
    <section class="section grid two">
      <article class="card chart-card">
        <h2>Projects by Sector</h2>
        ${barList(manualSector)}
      </article>
      <article class="card chart-card">
        <h2>Projects by Region</h2>
        ${barList(manualRegion)}
      </article>
    </section>
    <section class="section">
      <h2>Featured Opportunity Gaps</h2>
      <div class="grid three">
        ${featured.map((project) => projectCard(project, true)).join("")}
      </div>
    </section>
    <section class="section note-panel">
      <strong>Responsible recommendation boundary:</strong> Opportunity Atlas does not automatically decide who deserves funding. It helps funders discover, compare, and review overlooked local projects.
    </section>
  `;
}

function filterOptions(label, key, options) {
  return `<label>${escapeHtml(label)}
    <select data-filter="${escapeHtml(key)}">
      ${options.map((option) => `<option ${state.filters[key] === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
    </select>
  </label>`;
}

function matchesFilter(project) {
  const f = state.filters;
  const sectorMatch =
    f.sector === "All" ||
    project.sector === f.sector ||
    project.sector.split(" / ").includes(f.sector);
  return (
    (f.country === "All" || project.country === f.country) &&
    sectorMatch &&
    (f.stage === "All" || project.stage === f.stage) &&
    (f.readiness === "All" || project.readinessFilter === f.readiness) &&
    (f.gap === "All" || project.opportunityGap === f.gap) &&
    project.verification === "Self-reported"
  );
}

function renderDiscovery() {
  const visible = projects.filter(matchesFilter);
  $("#discovery").innerHTML = `
    ${pageHeader(
      "discovery-title",
      "Project Discovery",
      "Browse self-reported projects from young builders and grassroots teams.",
    )}
    <section class="filter-panel" aria-label="Project filters">
      ${filterOptions("Country", "country", ["All", "Ghana", "India", "Kenya", "Nigeria", "Indonesia"])}
      ${filterOptions("Sector", "sector", ["All", "Education", "Health", "Climate", "Agriculture", "Civic Tech"])}
      ${filterOptions("Stage", "stage", ["All", "Idea", "Prototype", "Pilot-ready", "Active users"])}
      ${filterOptions("Readiness", "readiness", ["All", "Early-stage", "Pilot-oriented", "Pilot-ready"])}
      ${filterOptions("Opportunity Gap", "gap", ["All", "Low", "Medium", "Medium-High", "High"])}
      ${filterOptions("Verification", "verification", ["Self-reported"])}
    </section>
    <section class="section">
      <div class="grid three">
        ${visible.length ? visible.map((project) => projectCard(project)).join("") : `<div class="empty">No projects match the selected filters.</div>`}
      </div>
    </section>
  `;
}

function getProject(id = state.selectedProjectId) {
  return projects.find((project) => project.id === id) || projects[0];
}

function getIntel(projectId) {
  return oecd.projectIntel?.[projectId] || {
    similarProjects: [],
    potentialFunders: [],
    gapSignal: { label: "Medium-High", interpretation: "Funding pattern requires review." },
  };
}

function renderProfileField(label, value) {
  return `<div class="field"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function renderSimilarTable(records) {
  const rows = records.slice(0, 6).map(
    (record) => `<tr>
      <td><strong>${escapeHtml(record.title)}</strong><br><span class="meta">${escapeHtml(truncateText(record.description || "No project description available."))}</span></td>
      <td>${escapeHtml(record.donor)}</td>
      <td>${escapeHtml(record.country)}</td>
      <td>${escapeHtml(record.sector)}</td>
      <td>${escapeHtml(record.year || "N/A")}</td>
      <td>${escapeHtml(record.amountLabel)}</td>
      <td>${escapeHtml(record.relevance)}</td>
    </tr>`,
  );
  return `<div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Project / Recipient Title</th>
          <th>Donor</th>
          <th>Country</th>
          <th>Sector</th>
          <th>Year</th>
          <th>Amount</th>
          <th>Relevance</th>
        </tr>
      </thead>
      <tbody>${rows.join("")}</tbody>
    </table>
  </div>`;
}

function renderFunders(funders) {
  if (!funders.length) {
    return `<div class="empty">No matching funder patterns were generated from the OECD records.</div>`;
  }
  return `<div class="grid three">
    ${funders
      .slice(0, 3)
      .map(
        (funder) => `<article class="card">
          <h3>${escapeHtml(funder.name)}</h3>
          <div class="badge-row">
            <span class="badge blue">Fit: ${escapeHtml(funder.fit)}</span>
            <span class="badge green">Matched funding: ${escapeHtml(funder.amountLabel)}</span>
          </div>
          <p class="meta">${escapeHtml(funder.reason)}</p>
        </article>`,
      )
      .join("")}
  </div>`;
}

function renderDetail() {
  const project = getProject();
  const intel = getIntel(project.id);
  const gap = intel.gapSignal || {};
  const gapLabel = project.opportunityGap;
  $("#detail").innerHTML = `
    ${pageHeader(
      "detail-title",
      project.title,
      `${project.country} · ${project.sector} · ${project.stage}`,
      "",
      `<span class="badge green">Verification Status: ${escapeHtml(project.verification)}</span>
       <button class="btn">Shortlist</button>
       <button class="btn">Request Evidence</button>
       <button class="btn primary">Invite to Apply</button>`,
    )}
    <section class="section detail-layout">
      <article class="card">
        <h2>Opportunity Profile</h2>
        <div class="profile-grid">
          ${renderProfileField("Project", project.title)}
          ${renderProfileField("Country", project.country)}
          ${renderProfileField("Region", project.region)}
          ${renderProfileField("Sector", project.sector)}
          ${renderProfileField("Subsector", project.subsector)}
          ${renderProfileField("Beneficiaries", project.beneficiaries)}
          ${renderProfileField("Stage", project.stage)}
          ${renderProfileField("Funding Need", `${project.fundingNeed} pilot grant`)}
          ${renderProfileField("Verification", project.verification)}
        </div>
      </article>
      <article class="card">
        <h2>Project Readiness</h2>
        <span class="badge blue">${escapeHtml(project.readiness)}</span>
        <div class="split-list section">
          <div>
            <h3>Strengths</h3>
            <ul>
              <li>Clear local problem</li>
              <li>Specific target beneficiaries</li>
              <li>Prototype claimed</li>
              <li>Concrete funding request</li>
            </ul>
          </div>
          <div>
            <h3>Needs Review</h3>
            <ul>
              <li>Pilot school confirmation needed</li>
              <li>Budget breakdown needed</li>
              <li>User feedback evidence needed</li>
              <li>Impact measurement plan needed</li>
            </ul>
          </div>
        </div>
      </article>
    </section>

    <section class="section card">
      <h2>Similar Funded Projects from OECD Records</h2>
      ${renderSimilarTable(intel.similarProjects || [])}
      <div class="section note-panel"><strong>Similar funded projects indicate funder relevance, not proof of project quality.</strong></div>
    </section>

    <section class="section card">
      <h2>Funder Relevance</h2>
      <p class="lead">OECD philanthropy data is used as a funding intelligence layer. It helps identify which funders may care about this project area based on historical funding behavior.</p>
      <div class="split-list">
        <div>
          <h3>Relevant funding patterns</h3>
          <ul>
            <li>${escapeHtml(project.sector)} projects have received funding in ${escapeHtml(project.region)}.</li>
            <li>Donors have previously supported related local delivery and access themes.</li>
            <li>The project aligns with historical philanthropy themes in OECD records.</li>
          </ul>
        </div>
        <div class="note-panel">
          <strong>Funding intelligence only</strong>
          <p>OECD data is not used as talent data. It contextualizes historical funding patterns, similar funded projects, and funder relevance.</p>
        </div>
      </div>
      <div class="section">
        <h3>Potentially Relevant Funders</h3>
        ${renderFunders(intel.potentialFunders || [])}
      </div>
    </section>

    <section class="section card">
      <h2>Opportunity Gap Signal</h2>
      <div class="badge-row">
        <span class="badge ${gapClass(gapLabel)}">${escapeHtml(gapLabel)}</span>
        <span class="badge blue">Country-sector funding: ${escapeHtml(gap.countrySectorAmountLabel || "Needs review")}</span>
        <span class="badge green">Sector median by country: ${escapeHtml(gap.sectorMedianCountryAmountLabel || "Needs review")}</span>
      </div>
      <h3 class="section">Why this may be overlooked:</h3>
      <ul>
        <li>${escapeHtml(project.sector)} is an active global funding area.</li>
        <li>${escapeHtml(project.country)} receives less targeted local funding than broader global activity in this theme.</li>
        <li>A local project signal exists in this underrepresented space.</li>
      </ul>
      <p class="lead section">This may be an overlooked opportunity for funders to investigate, not a guaranteed investment.</p>
      <div class="note-panel"><strong>Underfunding is a signal, not a conclusion.</strong></div>
    </section>

    <section class="section card">
      <h2>Recommended Review Questions</h2>
      <h3>Before shortlisting, ask:</h3>
      <ol>
        <li>Can the builder provide a demo or screenshots?</li>
        <li>Is there a letter from one pilot school?</li>
        <li>What is the 3-month pilot budget?</li>
        <li>How many students will be reached?</li>
        <li>What outcome will be measured?</li>
      </ol>
    </section>
  `;
}

function renderSubmit() {
  $("#submit").innerHTML = `
    ${pageHeader(
      "submit-title",
      "Submit a Local Project",
      "Turn an informal project into a funder-readable opportunity profile.",
    )}
    <section class="grid two">
      <form id="project-form" class="card">
        <div class="form-grid">
          <label>Project Title<input name="title" required value="Community tutoring map for public libraries" /></label>
          <label>Country<input name="country" required value="Colombia" /></label>
          <label>Region<input name="region" required value="Latin America" /></label>
          <label>Sector<input name="sector" required value="Education" /></label>
          <label class="wide">Project Description<textarea name="description" required>Student volunteers are mapping local tutoring availability and matching learners to low-cost sessions in public libraries.</textarea></label>
          <label>Target Beneficiaries<input name="beneficiaries" required value="Public school students" /></label>
          <label>Current Stage<input name="stage" required value="Prototype" /></label>
          <label>Funding Need<input name="funding" required value="$12,000" /></label>
          <label>Evidence Link, optional<input name="evidence" placeholder="https://..." /></label>
        </div>
        <div class="section">
          <button class="btn primary" type="submit">Generate Opportunity Profile</button>
        </div>
      </form>
      <article id="profile-preview" class="card">
        <h2>Generated Profile Preview</h2>
        <div class="empty">Generate an opportunity profile to preview the structured funder-readable record.</div>
      </article>
    </section>
  `;
}

function renderSignals() {
  const metrics = oecd.metrics || {};
  const yearly = oecd.fundingByYear || [];
  $("#signals").innerHTML = `
    ${pageHeader(
      "signals-title",
      "OECD Funding Signals",
      "Explore historical philanthropy funding patterns used to contextualize local projects.",
    )}
    <section class="grid four">
      ${kpi("Total Funding", metrics.totalFundingLabel || "$68.2B")}
      ${kpi("Funding Records", metrics.recordCountLabel || "116K+")}
      ${kpi("Recipient Countries", `${metrics.recipientCountries || 163}+`)}
      ${kpi("Donor Organizations", `${metrics.donorOrganizations || 506}+`)}
    </section>
    <section class="section filter-panel">
      ${filterOptions("Country", "country", ["All", "Ghana", "India", "Kenya", "Nigeria", "Indonesia"])}
      ${filterOptions("Sector", "sector", ["All", "Education", "Health", "Climate", "Agriculture", "Civic Tech"])}
      <label>Donor Country<select><option>All</option><option>United States</option><option>United Kingdom</option><option>Netherlands</option><option>Switzerland</option></select></label>
      <label>Year<select><option>All</option>${yearly.map((item) => `<option>${escapeHtml(item.year)}</option>`).join("")}</select></label>
    </section>
    <section class="section grid two">
      <article class="card chart-card">
        <h2>Funding by Year</h2>
        ${barList(yearly.map((item) => ({ label: item.year, amount: item.amount, amountLabel: item.amountLabel })), "amount")}
      </article>
      <article class="card chart-card">
        <h2>Top Recipient Countries</h2>
        ${barList(oecd.topRecipientCountries || [], "amount")}
      </article>
      <article class="card chart-card">
        <h2>Top Sectors</h2>
        ${barList(oecd.topSectors || [], "amount")}
      </article>
      <article class="card chart-card">
        <h2>Top Funders</h2>
        ${barList(oecd.topFunders || [], "amount")}
      </article>
    </section>
    <section class="section note-panel">
      <strong>OECD data is not used as talent data.</strong> It is used as funding intelligence to understand historical funding patterns, similar funded projects, and funder relevance.
    </section>
  `;
}

function renderCurrentPage() {
  renderOverview();
  renderDiscovery();
  renderDetail();
  renderSubmit();
  renderSignals();
  document.querySelectorAll(".page").forEach((page) => page.classList.toggle("active", page.id === state.page));
  document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.page === state.page));
}

function goTo(page) {
  state.page = page;
  renderCurrentPage();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest(".nav-link");
  if (nav) {
    goTo(nav.dataset.page);
    return;
  }

  const packet = event.target.closest(".packet-btn");
  if (packet) {
    state.selectedProjectId = packet.dataset.projectId;
    goTo("detail");
  }
});

document.addEventListener("change", (event) => {
  const filter = event.target.closest("[data-filter]");
  if (!filter) return;
  state.filters[filter.dataset.filter] = filter.value;
  renderDiscovery();
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "project-form") return;
  event.preventDefault();
  const form = new FormData(event.target);
  const preview = $("#profile-preview");
  preview.classList.add("active");
  preview.innerHTML = `
    <h2>Generated Profile Preview</h2>
    <div class="profile-grid">
      ${renderProfileField("Project title", form.get("title"))}
      ${renderProfileField("Country", form.get("country"))}
      ${renderProfileField("Sector", form.get("sector"))}
      ${renderProfileField("Beneficiaries", form.get("beneficiaries"))}
      ${renderProfileField("Stage", form.get("stage"))}
      ${renderProfileField("Funding need", form.get("funding"))}
      ${renderProfileField("Verification status", "Self-reported")}
    </div>
    <div class="section note-panel">Your project has been converted into a structured opportunity profile. In this MVP, all submissions are self-reported and not independently verified.</div>
  `;
});

renderCurrentPage();
