const server = 'http://localhost:5000';

async function run(){
  try{
    const res = await fetch(`${server}/api/jobs`);
    const jobs = await res.json();
    if(!jobs || jobs.length===0){
      console.log('No jobs');
      return;
    }
    const id = jobs[0]._id;
    console.log('Testing update for job id', id);

    const payload = { salary: 'UpdatedSalary-TEST-123' };
    const putRes = await fetch(`${server}/api/admin/test/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await putRes.json();
    console.log('PUT response status', putRes.status);
    console.log('PUT response body', body);
  }catch(err){
    console.error('Error', err.message);
  }
}

run();