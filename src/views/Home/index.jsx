import {useEffect, useState} from 'react'
import TaskImg from '../../assets/task.png'
import './index.css'

const descList = [
    {
        title: 'github',
        href: 'https://github.com/Doc2Feat-bench/Doc2Feat-bench',
        badge: 'https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white&style=for-the-badge'
    },
    {
        title: 'arxiv',
        href: 'https://arxiv.org/abs/2507.18130',
        badge: 'https://img.shields.io/badge/arXiv-900000?logo=arxiv&logoColor=white&style=for-the-badge'
    },
    {
        title: 'huggingface',
        href: 'https://huggingface.co/Doc2Feat-bench',
        badge: 'https://img.shields.io/badge/HuggingFace-FFD21E?logo=huggingface&logoColor=white&style=for-the-badge'
    },
    {
        title: 'dockerhub',
        href: 'https://hub.docker.com/repository/docker/nocodebench/nocode-bench/',
        badge: 'https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge'
    }
]

const Header = () => {
    return (
        <header>
            <div className="title">Doc2Feat-bench Leaderboard</div>
            <div className="sub-title">Evaluating Documentation-Driven Feature Addition
            </div>
            <div className="desc-list">
                {
                    descList.map((item, index) => {
                        return <a className="desc-item" href={item.href} key={index} target="_blank" rel="noreferrer">
                            <img src={item.badge} alt={item.title}/>
                        </a>
                    })
                }
            </div>
        </header>
    )
}
const Footer = () => {
    return (
        <footer>
            <div>
                made with 🥰 by <a href="http://www.icsoft.zju.edu.cn/" target="_blank" rel="noreferrer">ICSoft</a>
            </div>
        </footer>
    )
}

const TableWrapper = () => {
    const [activeBench, setActiveBench] = useState(0)
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const fullRes = await fetch(`${process.env.PUBLIC_URL}/leaderboard_data/full.json`)
            const verifiedRes = await fetch(`${process.env.PUBLIC_URL}/leaderboard_data/verified.json`)
            const fullData = await fullRes.json()
            const verifiedData = await verifiedRes.json()

            setLeaderboard([
                { name: 'Verified', data: verifiedData },
                { name: 'Full', data: fullData },
            ])
        }

        fetchData()
    }, [])

    return (
        <section>
            <div className="table-wrapper">
                <div className="table-title">
                    <div className='section-title'>Leaderboard</div>
                    <div className='bench-btns'>
                        {
                            leaderboard.map((item, index) => (
                                <div
                                    className={`bench-btn ${activeBench === index ? 'bench-btn__active' : ''}`}
                                    key={index}
                                    onClick={() => setActiveBench(index)}
                                >
                                    {item.name}
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>RANK</th>
                            <th>METHOD</th>
                            <th>MODEL</th>
                            <th>%SUCCESS</th>
                            <th>ORG</th>
                            <th>DATE</th>
                            <th>SITE</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                [...(leaderboard[activeBench]?.data || [])]
                                    .sort((a, b) => b.resolved - a.resolved)
                                    .map((item, index) => {
                                        const rank = index + 1
                                        let medal = ''
                                        if (rank === 1) medal = ' 🥇'
                                        else if (rank === 2) medal = ' 🥈'
                                        else if (rank === 3) medal = ' 🥉'
                                        let checked = ''
                                        if (item.verified) checked = ' ✅'

                                        return (
                                            <tr key={index}>
                                                <td>{medal || rank}{checked}</td>
                                                <td>{item.method}</td>
                                                <td>{item.model}</td>
                                                <td>{item.resolved}</td>
                                                <td>
                                                    {
                                                        item.org
                                                            ? <img src={item.model_logo} alt="model_logo" style={{ width: '20px', height: '20px' }} />
                                                            : '--'
                                                    }
                                                    &nbsp;&nbsp;&nbsp;
                                                    {
                                                        item.org
                                                            ? <img src={item.org} alt="org" style={{ width: '20px', height: '20px' }} />
                                                            : '--'
                                                    }
                                                </td>
                                                <td>{item.date}</td>
                                                <td>
                                                    {
                                                        item.site
                                                            ? <a
                                                                href={item.site}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                title={item.site}
                                                                style={{ textDecoration: 'none' }}
                                                            >
                                                                🔗
                                                            </a>
                                                            : '--'
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                            }
                            </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}


const SectionWrapper = ({title = '', subtitle = '', children}) => {
    return (
        <section className="section">
            <div className="section-title-row">
                <div className="section-title">{title}</div>
                {subtitle && <div className="section-subtitle">{subtitle}</div>}
            </div>
            <div className="section-content">
                {children}
            </div>
        </section>
    )
}

const citation = `@inproceedings{jiang2026doc2feat,
    title     = {Doc2Feat-Bench: Evaluating Documentation-Driven Feature Addition},
    author    = {Jiang, Zhonghao and Deng, Le and Cao, Jialun and Pradel, Michael and Liu, Zhongxin},
    booktitle = {Proceedings of the 41st IEEE/ACM International Conference on Automated Software Engineering},
    year      = {2026},
    publisher = {ACM},
    pages     = {2447--2459},
    doi       = {10.1145/3832783.3837489},
    url       = {https://doi.org/10.1145/3832783.3837489}
}`

const CitationBlock = () => {
    const [copyStatus, setCopyStatus] = useState('idle')

    useEffect(() => {
        if (copyStatus !== 'copied' && copyStatus !== 'error') return
        const timeout = setTimeout(() => setCopyStatus('idle'), 2500)
        return () => clearTimeout(timeout)
    }, [copyStatus])

    const copyCitation = async () => {
        setCopyStatus('copying')
        try {
            await navigator.clipboard.writeText(citation)
            setCopyStatus('copied')
        } catch {
            setCopyStatus('error')
        }
    }

    return (
        <div className="citation-block">
            <pre><code>{citation}</code></pre>
            <button
                type="button"
                className="citation-copy"
                onClick={copyCitation}
                disabled={copyStatus === 'copying'}
                aria-label={copyStatus === 'error' ? 'Copy failed. Try copying citation again' : 'Copy citation'}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {copyStatus === 'copied' ? <path d="m5 12 4 4L19 6"/> : <>
                        <rect x="8" y="8" width="12" height="12" rx="2"/>
                        <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>
                    </>}
                </svg>
                {copyStatus === 'copied' ? 'Copied!' : copyStatus === 'error' ? 'Try again' : copyStatus === 'copying' ? 'Copying…' : 'Copy'}
            </button>
            <span className="citation-copy-status" role="status">
                {copyStatus === 'copied' ? 'Citation copied to clipboard.' : copyStatus === 'error' ? 'Could not copy citation. Please try again.' : ''}
            </span>
        </div>
    )
}

const Index = ({leaderboard}) => {

    return (
        <>
            {/* 头部信息区域 */}
            <Header/>
            <main>
                {/* 表格区域 */}
                <TableWrapper leaderboard={leaderboard}/>
                {/* 信息区域 */}
                <SectionWrapper title='News'>
                    <ul>
                        <li>
                            <b>2026-10-15</b>: Presenting Doc2Feat-bench at the IEEE/ACM International Conference on Automated Software Engineering (ASE 2026).
                        </li>
                        <li>
                            <b>2025-07-22</b>: We have released Doc2Feat-bench, evaluate your SE Agents on real-world documentation-driven feature addition tasks here!
                        </li>
                    </ul>
                </SectionWrapper>
                <SectionWrapper title='Overview' subtitle='Introduction to Doc2Feat-bench'>
                    <div className='img-wrapper'>
                        <img src={TaskImg} alt="task"/>
                    </div>
                    <p>Doc2Feat-bench is a benchmark designed to evaluate the ability of Large Language Models (LLMs) to
                        perform documentation-driven feature addition using natural language documentation as input. Unlike prior
                        benchmarks that focus on bug fixing or general issue resolution, Doc2Feat-bench targets a new
                        paradigm where feature development is driven by documentation changes in real-world software
                        projects.</p>
                    <p>Each instance takes user-facing documentation changes as input and expects the model to generate
                        corresponding code changes. The implementation is validated using developer-written test
                        cases.</p>
                    <p></p>
                </SectionWrapper>
                <SectionWrapper title='How to submit?'>
                    If you are interested in submitting your system or model to any of our leaderboards (Doc2Feat-bench
                    [Verified, Full]), please follow the instructions posted at&nbsp;
                    <a href="https://github.com/Doc2Feat-bench/experiments" className="light-blue-link"
                       target="_blank"
                       rel="noopener noreferrer" style={{display: 'inline-flex', alignItems: 'center', gap: '5px'}}>
                        Doc2Feat-bench/experiments
                    </a>
                    .
                    <br/>
                    <br/>
                </SectionWrapper>
                <SectionWrapper title='Citation'>
                    If you found the <b>Doc2Feat-bench</b> and <b>Doc2Feat-bench Verified</b> helpful for your work, please cite as follows:
                    <CitationBlock/>
                    Correspondence to: <u>zhonghao.j@zju.edu.cn</u> and <u>liu_zx@zju.edu.cn</u>
                    <br/>
                    <br/>
                </SectionWrapper>
            </main>
            <Footer/>
        </>
    )
}

export default Index
