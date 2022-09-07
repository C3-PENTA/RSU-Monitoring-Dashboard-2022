import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Edge } from 'src/modules/node/entity/edge.entity';
import { Rsu } from 'src/modules/node/entity/rsu.entity';
import { Obu } from 'src/modules/node/entity/obu.entity';

export default class SeedEdgeRsuObu implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const countEdge = await connection
      .createQueryBuilder()
      .select()
      .from(Edge, 'Edge')
      .getCount();
    if (countEdge !== 0) {
      return;
    }
    const edgeRes = await connection
      .createQueryBuilder()
      .insert()
      .into(Edge)
      .values([{ name: 'Edge 1' }, { name: 'Edge 2' }])
      .execute();

    const countRsu = await connection
      .createQueryBuilder()
      .select()
      .from(Rsu, 'Rsu')
      .getCount();
    if (countRsu !== 0) {
      return;
    }
    const rsuRes = await connection
      .createQueryBuilder()
      .insert()
      .into(Rsu)
      .values([
        {
          name: 'RSU 1',
          cpu: 60,
          ram: 80,
          tx: 10,
          rx: 50,
          edge: (edgeRes.raw as Edge[])[0],
        },
        {
          name: 'RSU 2',
          cpu: 60,
          ram: 60,
          tx: 10,
          rx: 50,
          edge: (edgeRes.raw as Edge[])[0],
        },
        {
          name: 'RSU 3',
          cpu: 60,
          ram: 60,
          tx: 10,
          rx: 50,
          edge: (edgeRes.raw as Edge[])[1],
        },
        {
          name: 'RSU 4',
          cpu: 60,
          ram: 60,
          tx: 50,
          rx: 50,
          edge: (edgeRes.raw as Edge[])[1],
        },
      ])
      .execute();

    const countObu = await connection
      .createQueryBuilder()
      .select()
      .from(Obu, 'Obu')
      .getCount();
    if (countObu !== 0) {
      return;
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(Obu)
      .values([
        {
          name: 'OBU 1',
          rsu: (rsuRes.raw as Rsu[])[0],
        },
        {
          name: 'OBU 2',
          rsu: (rsuRes.raw as Rsu[])[0],
        },
        {
          name: 'OBU 3',
          rsu: (rsuRes.raw as Rsu[])[0],
        },
        {
          name: 'OBU 4',
          rsu: (rsuRes.raw as Rsu[])[1],
        },
        {
          name: 'OBU 5',
          rsu: (rsuRes.raw as Rsu[])[1],
        },
        {
          name: 'OBU 6',
          rsu: (rsuRes.raw as Rsu[])[1],
        },
        {
          name: 'OBU 7',
          rsu: (rsuRes.raw as Rsu[])[2],
        },
        {
          name: 'OBU 8',
          rsu: (rsuRes.raw as Rsu[])[2],
        },
        {
          name: 'OBU 9',
          rsu: (rsuRes.raw as Rsu[])[2],
        },
        {
          name: 'OBU 10',
          rsu: (rsuRes.raw as Rsu[])[3],
        },
        {
          name: 'OBU 11',
          rsu: (rsuRes.raw as Rsu[])[3],
        },
        {
          name: 'OBU 12',
          rsu: (rsuRes.raw as Rsu[])[3],
        },
      ])
      .execute();
  }
}
