import { lines, indent } from './strings';
/**
 * Statement builders for AQL
 */

export const buildLimit = (count: string, skip?: string) => {
  if (skip) {
    return `LIMIT ${skip} ${count}`;
  }

  return `LIMIT ${count}`;
};

export const buildFilter = (condition: string) => `FILTER ${condition}`;

export const buildSort = (
  property: string,
  order: string = 'ASC',
  sortOn: string = '$field'
) => `SORT ${sortOn}[${interpolationOrString(property)}] ${order}`;

export const buildQueryModifiers = ({
  limit,
  filter,
  sort,
}: {
  limit?: {
    count: string;
    skip?: string;
  };
  filter?: string;
  sort?: {
    property: string;
    order: string;
    sortOn?: string;
  };
}): string =>
  lines([
    filter && buildFilter(filter),
    sort && buildSort(sort.property, sort.order, sort.sortOn),
    limit && buildLimit(limit.count, limit.skip),
  ]);

export const buildSubquery = (contents: string, returnsList: boolean) =>
  lines([`${returnsList ? '' : 'FIRST'}(`, indent(contents), `)`]);

export const buildOptions = (options?: {
  bfs: boolean;
  uniqueVertices: string;
  uniqueEdges: string;
}) => {
  if (!options) {
    return '';
  }

  const pairs = [
    options.bfs !== undefined ? `bfs: ${options.bfs}` : '',
    options.uniqueVertices !== undefined
      ? `uniqueVertices: "${options.uniqueVertices}"`
      : '',
    options.uniqueEdges !== undefined
      ? `uniqueEdges: "${options.uniqueEdges}"`
      : '',
  ]
    .filter(Boolean)
    .join(', ');

  return `OPTIONS { ${pairs} }`;
};

const interpolationOrString = (value: string) =>
  value.startsWith('$') ? value : JSON.stringify(value);
