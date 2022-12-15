import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import * as d3 from 'd3';
import { useSafeState } from 'ahooks';

type SVGInstance = d3.Selection<any, any, any, any>;
type D3ElementObj = { [prop: string]: any };

export const useD3 = (
  renderFn: (svg: SVGInstance) => D3ElementObj = () => ({}),
  dependencies: any[] = []
): [RefObject<SVGSVGElement>, D3ElementObj] => {
  const ref = useRef<SVGSVGElement>(null);
  const [obj, setObj] = useSafeState<D3ElementObj>({});

  useEffect(() => {
    setObj(renderFn(d3.select(ref.current)));
    return () => setObj({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return [ref, obj];
}