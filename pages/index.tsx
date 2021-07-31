import Head from 'next/head'
import absoluteUrl from 'next-absolute-url'
import { FIREFOX_PREFS_VERSION } from '../tools/firefox-version'

const Home = ({ prefs }: { prefs }) => {
  return (
    <>
      <Head>
        <title>Firefox Preferences DB</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <section className="hero has-text-centered is-primary">
        <div className="hero-body">
          <img src={"/logo.svg"} width={48}></img>
          <p className="title" style={{ margin: "1rem 0" }}>
            Firefox Preferences Database
          </p>

          {/* <div className="field" style={{ maxWidth: "600px", margin: "0 auto", marginTop: "2rem" }}>
            <p className="control has-icons-left">
              <input className="input" placeholder="Search for a preference"></input>
              <span className="icon is-small is-left">
                <i style={{ backgroundImage: `url(/icons/search.svg)`, width: "14px", height: "14px", backgroundSize: "cover" }}></i>
              </span>
            </p>
          </div> */}
        </div>
      </section>

      <section className="hero has-text-centered">
        <div className="hero-body">
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left", marginBottom: "2rem" }}>
            <strong>Key:</strong>

            <span>⚠ - Preference hasn't been updated in a while, it is probably deprecated.</span>
          </div>

          <table className="table" style={{ margin: "0 auto", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ minWidth: "500px" }}>
                  <abbr>Preference ID</abbr>
                </th>
                <th>Default Value</th>
                <th>Description</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(prefs).map((data: any) => (
                <tr key={data[0]}>
                  <td>{data[0]}</td>
                  <td style={{ maxWidth: "500px", overflow: "scroll" }}>{data[1].default_value.toString()}</td>
                  <td>{data[1].description ? data[1].description : ( <i>
                    No description for this yet. <a href={"https://github.com/EnderDev/mozprefdb"}>Contribute?</a>
                  </i> )}</td>
                  <td>
                    {data[1].last_updated}
                    {data[1].last_updated
                      ? (parseInt(FIREFOX_PREFS_VERSION.split(".")[0]) - parseInt(data[1].last_updated.split(".")[0])) >= 3
                        ? " ⚠"
                        : ""
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

Home.getInitialProps = async (ctx) => {
  const { origin } = absoluteUrl(ctx.req)
  const res = await fetch(`${origin}/api/data`)
  const json = await res.json()
  console.log(json);
  return { prefs: json }
}

export default Home;