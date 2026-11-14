import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * 클라이언트 마운트 여부.
 * 서버 렌더링과 하이드레이션 중에는 false, 이후 클라이언트에서는 true를 반환한다.
 * (useEffect 안에서 setMounted(true)를 호출하는 패턴의 대체 —
 *  react-hooks/set-state-in-effect 규칙 위반과 불필요한 연쇄 렌더링을 피함)
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
