const fakeDom = `
<div class="container">
    <div class="row">
        <ul class="simplefilter">
            Simple filter controls:
            <li class="active" data-filter="all">All</li>
            <li data-filter="1">Cityscape</li>
            <li data-filter="2">Landscape</li>
            <li data-filter="3">Industrial</li>
            <li data-filter="4">Daylight</li>
            <li data-filter="5">Nightscape</li>
        </ul>
    </div>

    <div class="row">
        <ul class="multifilter">
            Multifilter controls:
            <li data-multifilter="1">Cityscape</li>
            <li data-multifilter="2">Landscape</li>
            <li data-multifilter="3">Industrial</li>
        </ul>
    </div>

    <div class="row">
        <ul class="sortandshuffle">
            Sort &amp; Shuffle controls:
            <li class="shuffle-btn" data-shuffle>Shuffle</li>
            <li class="sort-btn active" data-sortAsc>Asc</li>
            <li class="sort-btn" data-sortDesc>Desc</li>
            <select data-sortOrder>
                <option value="index">
                    Position
                </option>
                <option value="sortData">
                    Description
                </option>
            </select>
        </ul>
    </div>

    <div class="row search-row">
        Search control:
        <input type="text" class="filtr-search" name="filtr-search" data-search>
    </div>

    <div class="row">
        <div class="filtr-container">
            <div class="col-xs-6 col-sm-4 col-md-3 filtr-item" data-category="1, 5" data-sort="Busy streets">
                <img class="img-responsive" src="showcase/img/city_1.jpg" alt="sample image">
                <span class="item-desc">Busy Streets</span>
            </div>
            <div class="col-xs-6 col-sm-4 col-md-3 filtr-item" data-category="2, 5" data-sort="Luminous night">
                <img class="img-responsive" src="showcase/img/nature_2.jpg" alt="sample image">
                <span class="item-desc">Luminous night</span>
            </div>
            <div class="col-xs-6 col-sm-4 col-md-3 filtr-item" data-category="1, 4" data-sort="City wonders">
                <img class="img-responsive" src="showcase/img/city_3.jpg" alt="sample image">
                <span class="item-desc">city wonders</span>
            </div>
            <div class="col-xs-6 col-sm-4 col-md-3 filtr-item" data-category="3" data-sort="In production">
                <img class="img-responsive" src="showcase/img/industrial_1.jpg" alt="sample image">
                <span class="item-desc">in production</span>
            </div>
            <div class="col-xs-6 col-sm-4 col-md-3 filtr-item" data-category="3, 4" data-sort="Industrial site">
                <img class="img-responsive" src="showcase/img/industrial_2.jpg" alt="sample image">
                <span class="item-desc">industrial site</span>
            </div>
            <div class="col-xs-6 col-sm-4 col-md-3 filtr-item" data-category="2, 4" data-sort="Peaceful lake">
                <img class="img-responsive" src="showcase/img/nature_1.jpg" alt="sample image">
                <span class="item-desc">peaceful lake</span>
            </div>
            <div class="col-xs-6 col-sm-4 col-md-3 filtr-item" data-category="1, 5" data-sort="City lights">
                <img class="img-responsive" src="showcase/img/city_2.jpg" alt="sample image">
                <span class="item-desc">city lights</span>
            </div>
            <div class="col-xs-6 col-sm-4 col-md-3 filtr-item" data-category="2, 4" data-sort="Dreamhouse">
                <img class="img-responsive" src="showcase/img/nature_3.jpg" alt="sample image">
                <span class="item-desc">dreamhouse</span>
            </div>
            <div class="col-xs-6 col-sm-4 col-md-3 filtr-item" data-category="3" data-sort="Restless machines">
                <img class="img-responsive" src="showcase/img/industrial_3.jpg" alt="sample image">
                <span class="item-desc">restless machines</span>
            </div>
        </div>
    </div>
</div>
`;

export {
  fakeDom,
};
