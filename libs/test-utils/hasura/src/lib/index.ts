/* eslint-disable @typescript-eslint/no-var-requires */
const fetch = require('node-fetch');

const HASURA_ENDPOINT = 'http://localhost:9696/v1/metadata';
const HASURA_ADMIN_SECRET = 'password';

export async function reloadHasuraMetadata() {
  const res = await fetch(HASURA_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({
      type: 'reload_metadata',
      args: {
        reload_remote_schemas: false,
        reload_sources: false,
        recreate_event_triggers: false,
      },
    }),
  });

  if (res.status === 200) {
    const json = await res.json();
    if (!json.is_consistent) {
      console.error(
        'Hasura metadata is not consistent:',
        json.inconsistent_objects
      );
    }
  } else {
    const errorText = await res.text();
    console.error(
      `Hasura metadata reload failed with status ${res.status}: ${errorText}`
    );
    throw new Error(`Hasura metadata reload failed: ${errorText}`);
  }
}

export async function waitForHasuraReady() {
  const HASURA_HEALTH_ENDPOINT = 'http://localhost:9696/healthz';
  let retriesLeft = 5; // Number of times to retry before giving up.

  while (retriesLeft > 0) {
    try {
      const res = await fetch(HASURA_HEALTH_ENDPOINT);
      if (res.status === 200) {
        console.log('Hasura is ready');
        return;
      }
    } catch (e) {
      console.log(`Hasura not ready yet, retries left: ${retriesLeft}`);
      // Reduce the number of retries left.
      retriesLeft -= 1;
      // Wait for a bit before the next try.
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw new Error('Hasura did not become ready in time');
}
