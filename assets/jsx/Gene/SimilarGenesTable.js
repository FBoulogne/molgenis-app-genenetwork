var _ = require('lodash');
var React = require('react');
var Link = require('react-router').Link;
var Rectangle = require('../ReactComponents/SVGCollection').Rectangle;
var htmlutil = require('../../js/htmlutil');
var color = require('../../js/color');

var reactable = require('reactable');
var Tr = reactable.Tr;
var Td = reactable.Td;
var Table = reactable.Table;
var unsafe = reactable.unsafe;

var SimilarGenesTable = createReactClass({

    propTypes: {
        data: PropTypes.object
    },
    
    render: function() {

        var rows = _.map(this.props.data.data, function(gene, i) {

            var desc = (gene.gene.description || '').replace(/\[[^\]]+\]/g, '');
            return (<Tr key={gene.gene.id}>
                    <Td column="GENE" className='text'>
                    <Link className='black nodecoration' title={desc} to={`/gene/${gene.gene.name}`}>
                    <Rectangle title={gene.gene.biotype.replace(/_/g, ' ')} className='tablerectangle' fill={color.biotype2color[gene.gene.biotype] || color.colors.gnblack} />
                    <span>{gene.gene.name}</span>
                    </Link>
                    </Td>
                    <Td column="DESCRIPTION">
                    <Link className='black nodecoration' title={desc} to={`/gene/${gene.gene.name}`}>
                    {desc}
                    </Link>
                    </Td>
                    <Td column="P-VALUE">{unsafe(htmlutil.pValueToReadable(gene.pValue))}</Td>
                    </Tr>)
        });
        
        return (
                <Table className='rowcolors table gene-coreg-table'

                sortable={[
                    {
                        column: 'GENE',
                        sortFunction: function(a,b) {
                            var aGeneName = a.props.to.slice(6);
                            var bGeneName = b.props.to.slice(6);
                            return aGeneName.localeCompare(bGeneName)
                        }
                    },

                    {
                        column: 'DESCRIPTION',
                        sortFunction: function(a,b) {
                            return a.localeCompare(b)
                        }
                    },

                    {
                    column: "P-VALUE",
                    sortFunction: function(a, b) {

                        if (a.length < 5) {
                            if (b.length < 5) {             {/* a ?? b */}
                                return a - b
                            } else if (b[0] != '<') {    {/* a > b */}
                                return 1
                            } else {                        {/* a > b */}
                                return 1
                            }
                        } else if (a[0] != '<') {
                            if (b.length < 5) {             {/* a < b */}
                                return -1
                            } else if (b[0] != '<') {    {/* a ?? b */}

                                a = a.toString();
                                var aExponent = a.slice(53);
                                var aExp = aExponent.slice(0, aExponent.indexOf("<"));
                                var aNumber = a.slice(0,3);

                                b = b.toString();
                                var bExponent = b.slice(53);
                                var bExp = bExponent.slice(0, bExponent.indexOf("<"));
                                var bNumber = b.slice(0,3);

                                return aExp - bExp || aNumber - bNumber

                            } else {                        {/* a > b */}
                                return 1
                            }
                        } else {
                            if (b.length < 5) {             {/* a < b */}
                                return -1
                            } else if (b[0] != '<') {    {/* a <b */}
                                return -1
                            } else {

                                a = a.toString();
                                var aExponent = a.slice(55);
                                var aExp = aExponent.slice(0, aExponent.indexOf("<"));
                                var aNumber = a.slice(2,5);

                                b = b.toString();
                                var bExponent = b.slice(55);
                                var bExp = bExponent.slice(0, bExponent.indexOf("<"));
                                var bNumber = b.slice(2,5);

                                return aExp - bExp || aNumber - bNumber

                            }
                        }

                        return b - a
                    }
                }

                ]}>
                

                {rows}
                </Table>
        )
    }
});

module.exports = SimilarGenesTable;
