import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTreeData } from "../redux/referralSlice";
import "./ReferralTree.css"; // Import your CSS file here

export default function TopData() {
    const dispatch = useDispatch();
    const { auth } = useSelector((state) => state.auth);
    const { treeData } = useSelector((state) => state.referralTree);
    const [topGenerations, setTopGenerations] = useState([]);

    useEffect(() => {
        if (auth?.refferal_code) {
            dispatch(getTreeData(auth?.refferal_code));
        }
    }, [auth?.refferal_code, dispatch]);

    useEffect(() => {
        if (treeData) {
            const businessByGeneration = calculateBusinessPerGeneration(treeData);
            const sortedGenerations = Object.entries(businessByGeneration)
                .map(([generation, totalBusiness]) => ({ generation: parseInt(generation), totalBusiness }))
                .sort((a, b) => b.totalBusiness - a.totalBusiness)
                .slice(0, 3);
            setTopGenerations(sortedGenerations);
        }
    }, [treeData]);

    // Function to calculate business per generation
    const calculateBusinessPerGeneration = (users, generation = 1, result = {}) => {
        if (!users || users.length === 0) return result;

        // Initialize generation if not present
        if (!result[generation]) {
            result[generation] = 0;
        }

        // Sum active plans for current generation
        users.forEach(user => {
            result[generation] += user.active_plan || 0;
            // Recurse into the next generation with referrals
            if (user.referrals && user.referrals.length > 0) {
                calculateBusinessPerGeneration(user.referrals, generation + 1, result);
            }
        });

        return result;
    };

    return (
        <div>
            <h2>Top 3 Generations with Largest Business</h2>
            {topGenerations.length > 0 ? (
                <ul>
                    {topGenerations.map((gen) => (
                        <li key={gen.generation}>
                            <strong>Generation {gen.generation}:</strong> Total Business = {gen.totalBusiness}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}
