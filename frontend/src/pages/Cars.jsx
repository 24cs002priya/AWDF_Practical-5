import { useEffect, useMemo, useState } from 'react';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import CarCard from '../components/CarCard';
// Public REST API integration: sample vehicle records are mapped into nexTrip cards.
const ENDPOINT = 'https://dummyjson.com/products/category/vehicle';
export default function Cars() {
    const [cars, setCars] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState(''), [retry, setRetry] = useState(0), [search, setSearch] = useState('');
    useEffect(() => {
        const controller = new AbortController();
        async function load() {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(ENDPOINT, { signal: controller.signal });
                if (!res.ok)
                    throw new Error(`Public API returned ${res.status}`);
                const json = await res.json();
                if (!Array.isArray(json.products))
                    throw new Error('Unexpected vehicle data');
                setCars(json.products.map(p => ({ id: p.id, title: p.title, brand: p.brand, price: Math.round(p.price * 85), description: p.description, year: 'Demo' })));
            }
            catch (e) {
                if (e.name !== 'AbortError')
                    setError(e.message);
            }
            finally {
                if (!controller.signal.aborted)
                    setLoading(false);
            }
        }
        load();
        return () => controller.abort();
    }, [retry]);
    const visible = useMemo(() => cars.filter(c => c.title.toLowerCase().includes(search.toLowerCase())), [cars, search]);
    return <><h1>Discover cars</h1><p className="muted">Week 3 public REST API exercise; sample prices converted for demonstration only.</p><label>Search cars<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by car name"/></label><section className="section">{loading ? <Spinner /> : error ? <ErrorMessage message={error} onRetry={() => setRetry(x => x + 1)}/> : <><p>{visible.length} matching cars</p><div className="grid">{visible.map(c => <CarCard key={c.id} car={c}/>)}</div></>}</section></>;
}
