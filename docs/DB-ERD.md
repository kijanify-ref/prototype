# DB · ERD (개념)

```text
Cooperative 1──* Producer 1──* Farm
Farm 1──* Survey 1──* SurveyStep
Producer *──* SupplyChainNode
Farm *──* CarbonLot
CarbonLot 1──* EmissionLine
CarbonLot 1──1 DdsReport
EmissionFactor (국가·작물·공정)
User / Role / Notice
```

| 테이블 | 핵심 |
|--------|------|
| producer | name, country, coop_id, contact |
| farm | producer_id, lat, lng, area_ha, status |
| survey | farm_id, status, submitted_at |
| carbon_lot | lot_no, crop, mass_kg, intensity |
| emission_factor | country, crop, process, factor |
| dds_report | lot_id, status, generated_at |
| supply_node | lot_id, stage, actor, occurred_at |
