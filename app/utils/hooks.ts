import { useEffect, useRef, RefObject } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import { useCreation } from 'ahooks';

type SVGInstance = d3.Selection<any, any, any, any>;
type D3ElementObj = { [prop: string]: any };

export const useD3 = (
  renderFn: (svg: SVGInstance) => D3ElementObj = () => ({}),
  dependencies: any[] = []
): [RefObject<SVGSVGElement>, D3ElementObj] => {
  const ref = useRef<SVGSVGElement>(null);
  const obj = useCreation<D3ElementObj>(() => ({}), []);
  const clearObj = useCreation(() => () => _.forEach(obj, (_, k) => delete obj[k]), []);

  useEffect(() => {
    const newObj = renderFn(d3.select(ref.current));
    clearObj();
    _.forEach(newObj, (v, k) => obj[k] = v);
    return () => { clearObj(); };
  }, dependencies);

  return [ref, obj];
}