// Yahan apna Apps Script Web App URL daalo:
const API_URL = 'https://script.google.com/macros/s/AKfycbx3D8ieXve1wKZ_LeJ9yLIrXAnd7hj80elZjZjDLH5bH9YkDJ_PDXfOYEAJsr5RZQgf/exec';

// Generic API call helper
async function callApi(payload) {
  const res = await fetch(API_URL, {
    method: 'POST',
    mode: 'no-cors'
    headers: {
      'Content-Type': 'application/json'
    },
   
    if (!data.success) {
    throw new Error(data.error || 'Unknown server error');
  }

  return data;
}

// -------- Requirements --------

async function loadRequirements() {
  const tbody = document.querySelector('#reqTable tbody');
  tbody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';

  try {
    const data = await callApi({ action: 'listRequirements' });
    const list = data.data || [];

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">No requirements found.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    list.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.id || ''}</td>
        <td>${row.job_id || ''}</td>
        <td>${row.role || ''}</td>
        <td>${row.department || ''}</td>
        <td>${row.location || ''}</td>
        <td>${row.status || ''}</td>
        <td>${row.created_at || ''}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="7" class="text-danger">Error: ${err.message}</td></tr>`;
  }
}

async function submitRequirementForm(e) {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById('reqMessage');
  msg.textContent = 'Saving...';

  const payload = {
    action: 'createRequirement',
    role: form.role.value.trim(),
    department: form.department.value.trim(),
    location: form.location.value.trim()
  };

  try {
    const data = await callApi(payload);
    msg.textContent = 'Requirement created: ' + data.data.job_id;
    msg.classList.remove('text-danger');
    msg.classList.add('text-success');
    form.reset();
    loadRequirements();
  } catch (err) {
    msg.textContent = err.message;
    msg.classList.remove('text-success');
    msg.classList.add('text-danger');
  }
}

// -------- Candidates --------

async function loadCandidates() {
  const tbody = document.querySelector('#candTable tbody');
  tbody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';

  const filterJobId = document.getElementById('filterJobId').value.trim();

  const payload = {
    action: 'listCandidates'
  };
  if (filterJobId) {
    payload.job_id = filterJobId;
  }

  try {
    const data = await callApi(payload);
    const list = data.data || [];

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">No candidates found.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    list.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.id || ''}</td>
        <td>${row.job_id || ''}</td>
        <td>${row.name || ''}</td>
        <td>${row.mobile || ''}</td>
        <td>${row.source || ''}</td>
        <td>${row.stage || ''}</td>
        <td>${row.created_at || ''}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="7" class="text-danger">Error: ${err.message}</td></tr>`;
  }
}

async function submitCandidateForm(e) {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById('candMessage');
  msg.textContent = 'Saving...';

  const payload = {
    action: 'createCandidate',
    job_id: form.job_id.value.trim(),
    name: form.name.value.trim(),
    mobile: form.mobile.value.trim(),
    source: form.source.value.trim()
  };

  try {
    const data = await callApi(payload);
    msg.textContent = 'Candidate added: ID ' + data.data.id;
    msg.classList.remove('text-danger');
    msg.classList.add('text-success');
    form.reset();
    loadCandidates();
  } catch (err) {
    msg.textContent = err.message;
    msg.classList.remove('text-success');
    msg.classList.add('text-danger');
  }
}

// -------- Init --------

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('reqForm').addEventListener('submit', submitRequirementForm);
  document.getElementById('candForm').addEventListener('submit', submitCandidateForm);
  document.getElementById('btnReloadReq').addEventListener('click', loadRequirements);
  document.getElementById('btnReloadCand').addEventListener('click', loadCandidates);

  loadRequirements();
  loadCandidates();
});
