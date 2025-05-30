import { useLatestRelease } from "/src/hooks/useLatestRelease";

function LatestRelease() {
  const { release, error } = useLatestRelease();

  if (error) return <div>{error}</div>;
  if (!release) return <div>Cargando...</div>;

  return <div><h1>{release.tag_name}</h1></div>;
}

export default LatestRelease;
