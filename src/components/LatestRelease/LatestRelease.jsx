import { useLatestRelease } from "/src/hooks/useLatestRelease";
import '../Footer/Footer.css'

function LatestRelease() {
  const { release, error } = useLatestRelease();

  if (error) return <div>{error}</div>;
  if (!release) return <div>Cargando...</div>;

  return <div><h1 className="release-version">{release.tag_name}</h1></div>;
}

export default LatestRelease;
