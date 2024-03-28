import { useEffect, useState } from 'react';
import axios from 'axios';
import { base_adobe_url } from '../AppConfig';

const Badges = () => {
    const [badges, setBadges] = useState<any[]>([]);

    useEffect(() => {
        callApi();
    }, []);

    const callApi = async () => {
        const token = localStorage.getItem("access_token");
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            const response = await axios.get(`${base_adobe_url}/primeapi/v2/badges?page[offset]=0&page[limit]=2&sort=name`, config);
            const badgeData = response.data.data;
            
            // if (badgeData?.length > 0) {
            //     // Limiting to only 2 badges
            //     setBadges(badgeData.slice(0, 2));
            // }
            setBadges(badgeData)
        } catch (error) {
            console.error("Error fetching badges:", error);
        }
    }

    return (
        <div className="max-w-xs mx-auto bg-white overflow-hidden shadow-lg p-4">
            {badges.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                    <p className='font-medium col-span-2'>Badges earned</p>
                    {badges.map((badge, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <img
                                className="w-20 h-20 rounded-full"
                                src={badge?.attributes?.imageUrl || "https://via.placeholder.com/150"}
                                alt={badge?.attributes?.name || "Badge Image"}
                            />
                            <div className="mt-2">
                                <h2 className="text-xs">{badge?.attributes?.name}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            ) : <div>No badges found</div>}
        </div>
    );
}

export default Badges;
