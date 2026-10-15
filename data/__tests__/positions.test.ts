import { getPositions, getRemotePositions } from "../positions";

describe("positions", () => {
  it("loads static positions with required fields", () => {
    const positions = getPositions();
    expect(positions.length).toBeGreaterThan(0);
    for (const position of positions) {
      expect(position.id).toBeTruthy();
      expect(position.title).toBeTruthy();
      expect(position.organization).toBeTruthy();
      expect(position.url).toMatch(/^https?:\/\//);
      expect(position.source).toBeTruthy();
      expect(position.postedAt).toBeTruthy();
    }
  });

  it("filters remote positions", () => {
    const remote = getRemotePositions();
    expect(remote.length).toBeGreaterThan(0);
    expect(remote.every((position) => position.remote)).toBe(true);
  });
});
