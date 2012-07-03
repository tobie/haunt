// Bootstrap Pull-Request/Issue guidelines
// Questions?? please message @fat || @mdo
// =======================================

var assert = require('assert');

module.exports = {

    'pull-requests': {

        'should always be made against -wip branches': function (pull) {
            assert.ok(/\-wip$/.test(pull.base.label))
        },

        'should always be made from feature branches': function (pull) {
            assert.ok(pull.head.label != 'master')
        },

        'should always include a unit test if changing js files': function (pull) {
            var hasJS    = false
            var hasTests = false

            pull.files.forEach(function (file) {
                if (/^js\/[^./]+.js/.test(file.filename))            hasJS    = true
                if (/^js\/test\/unit\/[^.]+.js/.test(file.filename)) hasTests = true
            })

            assert.ok(!hasJS || hasJS && hasTests)
        },

        'after': function (pull) {
            if (pull.reporter.stats.failures) {
                pull.reportFailures(pull.close.bind(pull))
            }
        }

    },

    'issues': {

        'before': function (issue) {
            var plus = {}

            issue.comments.forEach(function (comment) {
                if (/\+1/.test(comment.body)) plus[comment.user.login] = true
            })

            if (Object.keys(plus) > 10) issue.tag('popular')
        },

        'should include a jsfiddle/jsbin illustrating the problem': function (issue) {
            assert.ok(/(jsfiddle|jsbin)/.test(issue.body))
        },

        'should include a tag to delegate the problem to @mdo or @fat': function (issue) {
            assert.ok(/tag: (js|css)/.test(issue.body))
        },

        'after': function (issue) {
            if (issue.reporter.stats.failures) {
                issue.reportFailures(issue.close.bind(issue))
            }
        }

    }

}