import { KinesisClient, PutRecordCommand } from '@aws-sdk/client-kinesis';

const client = new KinesisClient({});

const StreamName = process.env.CLICK_STREAM_NAME;

export default async function ingestClickstream(req, res) {
  if (!req.method === 'PUT') {
    res.status(405).send();
    return;
  }

  try {
    await client.send(
      new PutRecordCommand({
        Data: Buffer.from(JSON.stringify(req.body)),
        PartitionKey: 'csrb-ui-v1',
        StreamName,
      }),
    );
  } catch {}

  res.status(202).send();
}
