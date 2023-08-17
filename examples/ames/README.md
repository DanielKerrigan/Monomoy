# Ames, Iowa Housing Dataset

The dataset comes from the paper [Ames, Iowa: Alternative to the Boston Housing Data as an End of Semester Regression Projec](https://jse.amstat.org/v19n3/decock.pdf). The links to the dataset and data dictionary in the paper are dead. You can find the dataset [here](https://jse.amstat.org/v19n3/decock/AmesHousing.txt) and the data dictionary [here](https://jse.amstat.org/v19n3/decock/DataDocumentation.txt). A modified version of the data dictionary is available below.

## Data Dictionary

**Zoning**: Identifies the general zoning classification of the sale.

- Agriculture
- Commercial
- Floating Village: Floating Village Residential
- Industrial
- High Density - Residential High Density
- Med. Density - Residential Medium Density
- Low Density - Residential Low Density
 
**Lot Frontage**: Linear feet of street connected to property

**Lot Area**: Lot size in square feet

**Street**: Type of road access to property
- Gravel 
- Paved
        
**Alley**: Type of alley access to property

- Gravel
- Paved
- None -  No alley access
  
**Lot Shape**: General shape of property
- Reg: Regular
- Slightly irregular
- Moderately Irregular
- Irregular
       
**Land Contour**: Flatness of the property

- Level - Near Flat/Level 
- Banked - Quick and significant rise from street grade to building
- Hillside - Significant slope from side to side
- Depression - Low Depression
  
**Utilities**: Type of utilities available

- EGWS - All public Utilities (E,G,W,& S) 
- EGW: Electricity, Gas, and Water (Septic Tank)
- EG: Electricity and Gas Only
 
**Lot Configuration**: Lot configuration

- Inside - Inside lot
- Corner - Corner lot
- Cul-de-sac
- Frontage 2 sides - Frontage on 2 sides of property
- Frontage 3 sides - Frontage on 3 sides of property
 
**Land Slope**: Slope of property

- Gentle
- Moderate
- Severe
 
**Neighborhood**: Physical locations within Ames city limits (map available)

- Blmngtn - Bloomington Heights
- Blueste - Bluestem
- BrDale - Briardale
- BrkSide - Brookside
- ClearCr - Clear Creek
- CollgCr - College Creek
- Crawfor - Crawford
- Edwards - Edwards
- Gilbert - Gilbert
- Greens - Greens
- GrnHill - Green Hills
- IDOTRR - Iowa DOT and Rail Road
- Landmrk - Landmark
- MeadowV - Meadow Village
- Mitchel - Mitchell
- NAmes - North Ames
- NoRidge - Northridge
- NPkVill - Northpark Villa
- NridgHt - Northridge Heights
- NWAmes - Northwest Ames
- OldTown - Old Town
- SWISU - South & West of Iowa State University
- Sawyer - Sawyer
- SawyerW - Sawyer West
- Somerst - Somerset
- StoneBr - Stone Brook
- Timber - Timberland
- Veenker - Veenker

**Condition 1**: Proximity to various conditions

- Normal
- Adj. positive - Adjacent to postive off-site feature
- Near positive - Near positive off-site feature--park, greenbelt, etc.
- Artery - Adjacent to arterial street
- Feededr - Adjacent to feeder street 
- Near NS RR - Within 200' of North-South Railroad
- Adj. NS RR - Adjacent to North-South Railroad
- Near EW RR - Within 200' of East-West Railroad
- Adj. EW RR - Adjacent to East-West Railroad

**Condition 2**: Proximity to various conditions (if more than one is present)

- Normal
- Adj. positive - Adjacent to postive off-site feature
- Near positive - Near positive off-site feature--park, greenbelt, etc.
- Artery - Adjacent to arterial street
- Feededr - Adjacent to feeder street 
- Near NS RR - Within 200' of North-South Railroad
- Adj. NS RR - Adjacent to North-South Railroad
- Adj. EW RR - Adjacent to East-West Railroad
 
**Building Type**: Type of dwelling
  
- 1 Family - Single-family Detached 
- 2 Family Conv. - Two-family Conversion; originally built as one-family dwelling
- Duplex
- TwnhsE - Townhouse End Unit
- Twnhs - Townhouse Inside Unit
 
**House Style**: Style of dwelling
 
- 1 Story - One story
- 1.5 Finished - One and one-half story: 2nd level finished
- 1.5 Unfinished - One and one-half story: 2nd level unfinished
- 2 Story - Two story
- 2.5 Finished - Two and one-half story: 2nd level finished
- 2.5 Unfinished - Two and one-half story: 2nd level unfinished
- Split Foyer
- Split Level
 
**Overall Quality**: Rates the overall material and finish of the house

- 10 - Very Excellent
- 9 - Excellent
- 8 - Very Good
- 7 - Good
- 6 - Above Average
- 5 - Average
- 4 - Below Average
- 3 - Fair
- 2 - Poor
- 1 - Very Poor
 
**Overall Condition**: Rates the overall condition of the house

- 10 - Very Excellent
- 9 - Excellent
- 8 - Very Good
- 7 - Good
- 6 - Above Average 
- 5 - Average
- 4 - Below Average 
- 3 - Fair
- 2 - Poor
- 1 - Very Poor
  
**Year Built**: Original construction date

**Year Remodel**: Remodel date (same as construction date if no remodeling or additions)

**Roof Style**: Type of roof

- Flat
- Gable
- Gambrel - Gambrel Gabrel (Barn)
- Hip
- Mansard
- Shed
  
**Roof Material**: Roof material

- Tile - Clay or Tile
- Shingle - Standard (Composite) Shingle
- Membrane
- Metal
- Roll
- Tar - Gravel & Tar
- Wood Shakes
- Wood Shingles
  
**Exterior 1st**: Exterior covering on house

- Asbestos Shingles
- Asphalt Shingles
- Brick Common
- Brick Face
- Cinder Block
- Cement Board
- Hard Board
- Imitation Stucco
- Metal Siding
- Other
- Plywood
- PreCast 
- Stone
- Stucco
- Vinyl Siding
- Wood Siding
- Wood Shingles
 
**Exterior 2nd**: Exterior covering on house (if more than one material)

- Asbestos Shingles
- Asphalt Shingles
- Brick Common
- Brick Face
- Cinder Block
- Cement Board
- Hard Board
- Imitation Stucco
- Metal Siding
- Other
- Plywood
- PreCast
- Stone
- Stucco
- Vinyl Siding
- Wood Siding
- Wood Shingles
 
**Masonry Veneer**: Masonry veneer type

- Brick Common
- Brick Face
- Cinder Block
- None
- Stone
 
**Masonry Veneer Area**: Masonry veneer area in square feet

**Exterior Quality**: Evaluates the quality of the material on the exterior 
  
- Excellent
- Good
- Typical
- Fair
- Poor
  
**Exterior Condition**: Evaluates the present condition of the material on the exterior

- Excellent
- Good
- Typical
- Fair
- Poor
  
**Foundation**: Type of foundation
  
- Brick - Brick & Tile
- Cinder Block
- Concrete - Poured Contrete 
- Slab
- Stone
- Wood
  
**Basement Height**: Height of the basement in inches

- 100+ 
- 90-99 
- 80-89 
- 70-79 
- <70 
- No Basement
  
**Bsmt Condition**: Evaluates the general condition of the basement

- Excellent
- Good
- Typical - slight dampness allowed
- Fair - dampness or some cracking or settling
- Poor - Severe cracking, settling, or wetness
- No Basement
 
**Bsmt Exposure**: Refers to walkout or garden level walls

- Good: Good Exposure
- Average: Average Exposure (split levels or foyers typically score average or above) 
- Minimum: Mimimum Exposure
- No exposure
- No basement
 
**Basement Finish Rating 1**: Rating of basement finished area

- Good Living Quarters
- Average Living Quarters
- Below Average Living Quarters 
- Average Rec Room
- Low Quality
- Unfinshed
- No basement
  
**Basement Finish Area 1**: Type 1 finished square feet

**Basement Finish Rating 2**: Rating of basement finished area (if multiple types)

- Good Living Quarters
- Average Living Quarters
- Below Average Living Quarters 
- Average Rec Room
- Low Quality
- Unfinshed
- No basement

**Basement Finish Area 2**: Type 2 finished square feet

**Basement Unfinished Area**: Unfinished square feet of basement area

**Total Basement Area**: Total square feet of basement area

**Heating**: Type of heating
  
- Floor Furnace
- Gas, Air - Gas forced warm air furnace
- Gas, Water - Gas hot water or steam heat
- Gravity furnace 
- Non-gas, water - Hot water or steam heat other than gas
- Wall furnace
  
**Heating Quality**: Heating quality and condition

- Excellent
- Good
- Typical
- Fair
- Poor
  
**Central Air**: Central air conditioning
- No
- Yes
  
**Electrical**: Electrical system

- Circuit Breakers - Standard Circuit Breakers & Romex
- Avg. Fuse Box - FuseA Fuse Box over 60 AMP and all Romex wiring (Average) 
- Fair Fuse Box - FuseF 60 AMP Fuse Box and mostly Romex wiring (Fair)
- Poor Fuse Box - FuseP 60 AMP Fuse Box and mostly knob & tube wiring (poor)
- Mix - Mixed
  
**1st Floor Area**: First Floor square feet
 
**2nd Floor Area**: Second floor square feet

**Low Quality Finished Area**: Low quality finished square feet (all floors)

**Above Ground Living Area**: Above grade (ground) living area square feet

**Basement Full Baths**: Basement full bathrooms

**Basement Half Baths**: Basement half bathrooms

**Full Baths**: Full bathrooms above grade

**Half Baths**: Half baths above grade

**Bedrooms Above Ground**: Bedrooms above grade (does NOT include basement bedrooms)

**Kitchens Above Ground**: Kitchens above grade

**Kitchen Quality**: Kitchen quality

- Excellent
- Good
- Typical
- Fair
- Poor
        
**Rooms Above Ground**: Total rooms above grade (does not include bathrooms)

**Functionality**: Home functionality (Assume typical unless deductions are warranted)

- Typical
- Minor Deductions 1
- Minor Deductions 2
- Moderate Deductions
- Major Deductions 1
- Major Deductions 2
- Severely Damaged
- Salvage only
  
**Fireplaces**: Number of fireplaces

**Fireplace Quality**: Fireplace quality

- Excellent - Exceptional Masonry Fireplace
- Good - Masonry Fireplace in main level
- Typical - Prefabricated Fireplace in main living area or Masonry Fireplace in basement
- Fair - Prefabricated Fireplace in basement
- Poor - Ben Franklin Stove
- No fireplace
  
**Garage Type**: Garage location
  
- Multiple - More than one type of garage
- Attached - Attached to home
- Basement - Basement Garage
- Built In - Built-In (Garage part of house - typically has room above garage)
- Car Port
- Detached - Detached from home
- None - No Garage
  
**Garage Year**: Year garage was built (same as year the house was built if no garage)

**Garage Finish**: Interior finish of the garage

- Finished
- Rough Finished 
- Unfinished
- No garage

**Garage Cars**: Size of garage in car capacity

**Garage Area**: Size of garage in square feet

**Garage Quality**: Garage quality

- Excellent
- Good
- Typical
- Fair
- Poor
- No Garage
  
**Garage Condition**: Garage condition

- Excellent
- Good
- Typical
- Fair
- Poor
- No garage
  
**Paved Drive**: Paved driveway

- Paved 
- Partial: Partial Pavement
- Dirt: Dirt/Gravel
  
**Wood Deck Area**: Wood deck area in square feet

**Open Porch Area**: Open porch area in square feet

**Enclosed Porch Area**: Enclosed porch area in square feet

**3 Season Porch Area**: Three season porch area in square feet

**Screen Porch**: Screen porch area in square feet

**Pool Area**: Pool area in square feet

**Pool Quality**: Pool quality
  
- Excellent
- Good
- Average/Typical
- Fair
- No Pool
  
**Fence**: Fence quality

- Good Privacy
- Min. Privacy - Minimum Privacy
- Good Wood
- Min. Wood/wire - Minimum Wood/Wire
- None - No Fence
 
**Misc Feature**: Miscellaneous feature not covered in other categories
  
- Elevator
- 2nd Garage - 2nd Garage (if not described in garage section)
- Other
- Shed - Shed (over 100 SF)
- Tennis Court
- None
  
**Misc Value**: $Value of miscellaneous feature

**Month Sold**: Month Sold (MM)

**Year Sold**: Year Sold (YYYY)

**Sale Type**: Type of sale
  
- Deed - Warranty Deed - Conventional
- Cash Deed - Warranty Deed - Cash
- VA Loan Deed - Warranty Deed - VA Loan
- New - Home just constructed and sold
- Estate - Court Officer Deed/Estate
- Contract - Contract 15% Down payment regular terms
- Low Int. + Down. Contract - Contract Low Down payment and low interest
- Low Interest Contract - Contract Low Interest
- Low Down Payment Contract - Contract Low Down
- Other
  
**Sale Condition**: Condition of sale

- Normal - Normal Sale
- Abnorml - Abnormal Sale -  trade, foreclosure, short sale
- Adjoining - Adjoining Land Purchase
- Allocation - two linked properties with separate deeds, typically condo with a garage unit 
- Family - Sale between family members
- Partial - Home was not completed when last assessed (associated with New Homes)
