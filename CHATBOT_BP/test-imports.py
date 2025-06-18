import io
from fpdf import FPDF
import zipfile
import random

# Temas y títulos para los PDFs
topics = [
    "Braking Systems",
    "Interior Ergonomics",
    "Chassis Stiffness",
    "Crash Safety Design",
    "Electrical Wiring",
    "Aerodynamics",
    "Lighting Systems",
    "Engine Bay Layout",
    "HVAC System Integration",
    "Noise & Vibration Control"
]

long_best_practices = [
    [
        "1. Brake Pedal Travel Standard\nKeep brake pedal travel between 25-38mm for optimal ergonomics and fast reaction time. Too much travel increases delay; too little can be uncomfortable.",
        "2. ABS Sensor Placement\nInstall ABS sensors at 65mm or more from the rotating axle to avoid magnetic interference. Improper placement causes sensor faults or intermittent readings.",
        "3. Brake Line Routing\nMaintain minimum clearance of 17mm from all moving suspension elements. Incorrect routing can cause abrasion and long-term failure.",
        "4. Caliper Mounting Bolt Torque\nApply 90-105Nm for M10 bolts in brake caliper mounting. Over/under torque risks loosening or thread damage.",
        "5. Brake Fluid Reservoir Access\nDesign engine bay for direct access to reservoir. Poor access increases service time and chance of contamination.",
        "6. Dust Shield Gaps\nGaps should be 2-4mm to avoid noise or debris jamming. Excessive gap causes exposure, too little causes scraping.",
        "7. Brake Pad Material\nUse semi-metallic for high-performance, ceramic for daily use. Wrong selection causes noise or wear issues.",
        "8. Redundancy in Brake Circuits\nDual diagonal circuit recommended for safety. Single circuit risks total brake loss in failure."
    ],
    [
        "1. Seat Adjustment Range\nProvide minimum 250mm travel for front seats. Ensures accommodation for 5th-95th percentile occupants.",
        "2. Seat Height & Visibility\nHeight must permit clear line-of-sight over dashboard (min 90cm eye point). Poor height reduces visibility and increases fatigue.",
        "3. Head Restraint Position\nPosition 85-95mm behind head at seat's upright setting. Poor placement increases whiplash risk.",
        "4. Switch Placement\nAll critical switches within 60cm radius from steering center. Reduces distraction and improves safety.",
        "5. Interior Lighting\nFootwell and dome lights must provide >30 lux. Poor lighting reduces comfort at night.",
        "6. Ergonomic Handles\nPull handles must be reachable with minimal wrist deviation. Bad placement leads to strain.",
        "7. Steering Wheel Reach\nOffer telescopic adjustment of at least 50mm.",
        "8. Dashboard Glare Reduction\nUse matte surfaces to avoid sunlight reflection."
    ],
    [
        "1. Minimum Bending Stiffness\nDesign chassis to achieve at least 18,000 Nm/degree torsional rigidity for sedans. Low stiffness results in poor handling.",
        "2. Weld Seam Patterns\nUse staggered seams for joining high-stress zones. Unbroken seams risk stress risers.",
        "3. Crossmember Placement\nLocate main crossmembers at suspension pickup points.",
        "4. Rust Prevention Coatings\nAll bare metals to be treated with e-coat or galvanization.",
        "5. Impact Absorption Zones\nFront/rear crumple zones designed to deform progressively.",
        "6. Suspension Mount Reinforcement\nUse extra gussets at strut towers.",
        "7. Bolt Grade Standards\nChassis bolts must be minimum grade 10.9.",
        "8. Corrosion Drain Holes\nProvide 3-4mm drain holes at low points."
    ],
    [
        "1. Front Crash Structure\nMust absorb 55%+ of 64km/h offset crash energy.",
        "2. Door Intrusion Beams\nPlace at mid-door height. Prevents intrusion >15cm at 50km/h.",
        "3. Airbag Module Mounting\nMount on reinforced dash cross tube.",
        "4. Pedestrian Protection\nBonnet gap min 50mm above hard points.",
        "5. Battery Cut-off Location\nEasily accessible from exterior post-crash.",
        "6. Safety Labeling\nAll airbags and explosive charges clearly labeled.",
        "7. Fuel Line Routing\nAvoid routing through crumple zones.",
        "8. Fire Retardant Materials\nUse in engine bay and cabin bulkhead."
    ],
    [
        "1. Main Power Distribution\nFuse boxes in accessible locations. Avoid routing through hot zones.",
        "2. Grounding Points\nAll ground connections less than 25cm from major loads.",
        "3. CAN Bus Segregation\nPhysical separation of critical (brakes, powertrain) from comfort (audio, seats).",
        "4. Harness Retention\nAll harnesses clipped every 25cm.",
        "5. Connector IP Ratings\nAll engine-bay connectors IP67 or better.",
        "6. Overcurrent Protection\nUse correctly rated fuses for all loads.",
        "7. Battery Isolation\nProvide service disconnect within 1 meter of battery.",
        "8. Harness Bend Radius\nNo bends tighter than 4x cable diameter."
    ],
    [
        "1. Drag Coefficient Goals\nTarget Cd < 0.28 for sedans, < 0.33 for SUVs.",
        "2. Underbody Paneling\nAt least 85% of underbody should be covered.",
        "3. Mirror Shape\nDesign to minimize vortex shedding at highway speed.",
        "4. Grille Shutters\nActive shutters for engine cooling reduce drag.",
        "5. Spoiler Angle\nMaximum 15 degrees unless proven otherwise in wind tunnel.",
        "6. Window Seal Gap\nNo more than 2mm gap at window seals.",
        "7. Wiper Park Location\nConceal wipers below hood line.",
        "8. Rain Channel Integration\nChannels must direct water away from A-pillars."
    ],
    [
        "1. Headlight Height Regulation\nMount height between 600-700mm (center).",
        "2. DRL Placement\nWithin 40cm of vehicle edge.",
        "3. Light Output\nMin 1000 lumens for low beam, 1600 for high.",
        "4. Condensation Management\nVents or hydrophobic coatings required.",
        "5. Taillight Mounting\nIntegrated into quarter panels.",
        "6. Wire Routing\nNo wires exposed to wheel wells.",
        "7. Fog Lamp Position\nNo lower than 250mm above ground.",
        "8. Bulb Replacement Access\n<5 min removal for standard bulbs."
    ],
    [
        "1. Heat Source Separation\nNo more than 15cm between exhaust manifold and firewall.",
        "2. Serviceability Clearance\nMinimum 75mm access gap for major service items.",
        "3. Fluid Reservoir Grouping\nGroup brake, coolant, washer fluid for service.",
        "4. Battery Location\nSecure against vibration and heat.",
        "5. Mount Reinforcement\nAll mounts must support >3g static load.",
        "6. Wiring Harness Heat Shields\nUse for any wire <30mm from exhaust.",
        "7. Coolant Hose Routing\nMinimize length and sharp bends.",
        "8. Dipstick Access\nAccessible from top with one hand."
    ],
    [
        "1. Vent Placement\nFace vents toward occupant breathing zones.",
        "2. Filter Service Interval\nDesign for 2-minute filter swap.",
        "3. Condensation Drain\nAll evaporators must drain externally.",
        "4. HVAC Noise Control\nMax 52dBA at full fan.",
        "5. Temperature Sensor Location\nNo direct sun exposure.",
        "6. Duct Insulation\nAll ducts insulated in engine bay.",
        "7. Blend Door Motor Access\nServiceable without dash removal.",
        "8. Dual Zone Layout\nIndependent driver/passenger temp blending."
    ],
    [
        "1. NVH Patch Panels\nReinforce floorpan at main vibration sources.",
        "2. Door Seal Compression\n8-10mm compression for air/water tightness.",
        "3. Acoustic Glass\nFront windshield acoustic laminated.",
        "4. BSR Prevention\nSecure all harnesses, hoses to prevent buzz/squeak/rattle.",
        "5. Engine Mount Isolation\nMulti-stage mounts to cut idle vibration.",
        "6. Wheel Arch Liner\nAbsorptive liners in all four arches.",
        "7. Rear Seat Frame Dampers\nInstall for subwoofer models.",
        "8. Roof Damping Pads\nMin 2 pads per roof side."
    ]
]

# Generar PDFs ficticios y guardarlos en memoria
in_memory_zip = io.BytesIO()
with zipfile.ZipFile(in_memory_zip, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
    for i, topic in enumerate(topics):
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        pdf.set_font("Arial", "B", 18)
        pdf.cell(0, 12, f"Best Practices in {topic}", ln=True, align="C")
        pdf.ln(8)
        pdf.set_font("Arial", "", 13)
        for section in long_best_practices[i]:
            pdf.multi_cell(0, 8, section)
            pdf.ln(2)
        # Extra: más texto ficticio para hacerlos largos
        for _ in range(6):
            pdf.multi_cell(
                0, 8,
                f"Nota adicional: {topic} requiere validaciones y revisiones constantes para adaptarse a normativas internacionales. Mantén la documentación de cambios en el diseño y revisa los puntos de control en cada ciclo de desarrollo.\n"
            )
        pdf.output(f"best_practices_{i+1}.pdf")
        # Guardar en ZIP en memoria
        pdf_bytes = pdf.output(dest='S').encode('latin1')
        zf.writestr(f"best_practices_{i+1}.pdf", pdf_bytes)

in_memory_zip.seek(0)
with open("./DATA", "wb") as f:
    f.write(in_memory_zip.read())
