#!/usr/bin/perl -w

use strict; 
use warnings;
use Data::Dumper;
use JSON; # Uncomment this line if you have the JSON module

# To pretty print hash
$Data::Dumper::Indent = 1;

# Read data from STDIN
#  STDIN must be comma separated data with the following columns:
#  userid,parentid,childid,childname,idirectory
open(DATA,"-") or die "Can't open data: $!";

# Datastructure Hashes
my $hierarchy_pc; # Intermediary hash to store parent to child relationship
my $hierarchy;    # Final hash to store parent to child relationship

#-------------------------------------------------------------------------------
# Step 1 of 3
#
# Read lines from STDIN
#  STDIN must be comma separated data with the following columns:
#  userid,parentid,childid,childname,idirectory
#
#-------------------------------------------------------------------------------
while(<DATA>) {
  
  next if(/^\s*$/ | /^\s*#/ );
  
  my( $userid, $parentId, $childId, $childName, $isdirectory ) = split(/,/, $_);
  $isdirectory =~ s/\n//g;
  
  # Determine if datastructure element is a folder or file
  #  this needs improvement
  my $type = 'folder' if( $isdirectory =~ /TRUE|1/gi );
  $type    = 'file'   if( $isdirectory =~ /FALSE|0/gi );

  # Add name & type of datastructure element to hash for $parentId & $childId
  $hierarchy_pc->{$parentId}->{'children'}->{$childId}->{'name'} = $childName;
  $hierarchy_pc->{$parentId}->{'children'}->{$childId}->{'type'} = $type;
  
  # For folders add children key
  if( $type eq 'folder' ) {
    $hierarchy_pc->{$parentId}->{'children'}->{$childId}->{'children'} = {};
  }
  
}
#-------------------------------------------------------------------------------

#-------------------------------------------------------------------------------
# Step 2 of 3
#
# Determine if a child is also a parent; if so, add it to $hierarchy
#
#-------------------------------------------------------------------------------
foreach my $parentId ( keys %{$hierarchy_pc} ) {
  
  foreach my $childId ( keys %{$hierarchy_pc->{$parentId}->{'children'}} ) {
    
    # Copy $hierarchy_pc to $hierarchy
    $hierarchy->{$parentId}->{'children'} = $hierarchy_pc->{$parentId}->{'children'};
    
    # Is child $childId also a parent ?
    if( exists $hierarchy_pc->{$childId} ) {    
      $hierarchy->{"$parentId"}->{'children'}->{"$childId"}->{'children'} = $hierarchy_pc->{"$childId"}->{'children'};
    }

  }

}
#-------------------------------------------------------------------------------

#-------------------------------------------------------------------------------
# Step 3 of 3
#
# Delete keys whose parent is not <HOME>. They are aliens.
#
#-------------------------------------------------------------------------------
foreach my $k ( keys %{$hierarchy} ) {
  if( $k !~ /\<HOME\>/i ) {
    delete $hierarchy->{"$k"};
  }
}
#-------------------------------------------------------------------------------

print to_json( $hierarchy, { ascii => 1, pretty => 1 } );

