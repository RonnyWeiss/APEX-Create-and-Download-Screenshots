function apexCreateScreenshotPlugin(pSelf, pFileName) {
    "use strict";
    var util = {
        featureDetails: {
            name: "APEX Create and Download Screenshots",
            scriptVersion: "1.0.0.0",
            utilVersion: "1.6",
            url: "https://github.com/RonnyWeiss",
            license: "MIT"
        },
        loader: {
            start: function (id, setMinHeight) {
                if (setMinHeight) {
                    $(id).css("min-height", "100px");
                }
                apex.util.showSpinner($(id));
            },
            stop: function (id, removeMinHeight) {
                if (removeMinHeight) {
                    $(id).css("min-height", "");
                }
                $(id + " > .u-Processing").remove();
                $(id + " > .ct-loader").remove();
            }
        },
        isDefinedAndNotNull: function (pInput) {
            if (typeof pInput !== "undefined" && pInput !== null && pInput != "") {
                return true;
            } else {
                return false;
            }
        }
    };

    var loadSel = "html";

    apex.debug.info({
        "fct": util.featureDetails.name + " - " + "apexCheckboxToggle",
        "arguments": {
            "pSelf": pSelf
        },
        "featureDetails": util.featureDetails
    });

    util.loader.start(loadSel);

    //WORKAROUND: html2canvas has problems with svgs and box shadow
    $.each($(pSelf.affectedElements), function (i, item) {
        $(item).addClass("remove-box-shadows");
        $(item).find("*").addClass("remove-box-shadows");
    });

    try {
        // WORKAROUND: html2canvas starts to fast so loader is not rendered with short wait
        setTimeout(function () {
            $.each($(pSelf.affectedElements), function (i, item) {
                html2canvas132($(item)[0], {
                    "logging": (apex.debug.getLevel() >= 4)
                })
                    .then(canvas => {
                        var url = canvas.toDataURL();
                        var downlo = $("<a>");
                        downlo.attr("href", url);
                        if (util.isDefinedAndNotNull(pFileName)) {
                            downlo.attr("download", pFileName + ".png");
                        } else {
                            downlo.attr("download", "screenshot_" + new Date().toLocaleDateString() + ".png");
                        }
                        downlo.appendTo("body");
                        util.loader.stop(loadSel);
                        downlo[0].click();
                        downlo.remove();
                        // remove added box shadow helper class
                        $(item).removeClass("remove-box-shadows");
                        $(item).find("*").removeClass("remove-box-shadows");
                    });
            });
        }, 50);
    } catch (err) {
        util.loader.stop(loadSel);
        apex.debug.error({
            "fct": util.featureDetails.name + " - " + " execute html2canvas",
            "msg": "Error while to execute html2canvas",
            "err": err,
            "featureDetails": util.featureDetails
        });
    }
}
